import { Card, CardContent, CardHeader, CardTitle, Badge, Car, MapPin, Activity } from "../components/basic-ui"
import type { Prediction, NotificationResponse } from "../types/notifications"
import type { ParkingSpace } from "../types/notifications"

interface ParkingLotViewProps {
  notifications?: NotificationResponse | null
  totalSpaces?: number
  gridCols?: number
  gridRows?: number
}

// Mock data para demostración - solo cuando no hay datos reales
const mockNotifications: NotificationResponse = {
  predictions: [
    { x1: 50, y1: 30, x2: 150, y2: 80, confidence: 0.95, class_id: 0, class_name: "car" },
    { x1: 200, y1: 30, x2: 300, y2: 80, confidence: 0.88, class_id: 0, class_name: "car" },
    { x1: 350, y1: 30, x2: 450, y2: 80, confidence: 0.92, class_id: 0, class_name: "car" },
    { x1: 50, y1: 180, x2: 150, y2: 230, confidence: 0.87, class_id: 0, class_name: "car" },
    { x1: 350, y1: 180, x2: 450, y2: 230, confidence: 0.91, class_id: 0, class_name: "car" },
    { x1: 50, y1: 330, x2: 150, y2: 380, confidence: 0.89, class_id: 0, class_name: "car" },
    { x1: 200, y1: 330, x2: 300, y2: 380, confidence: 0.93, class_id: 0, class_name: "car" },
    { x1: 500, y1: 330, x2: 600, y2: 380, confidence: 0.86, class_id: 0, class_name: "car" },
  ],
}

export default function ParkingLotView({
  notifications = mockNotifications,
  totalSpaces = 36,
  gridCols = 6,
  gridRows = 6,
}: ParkingLotViewProps) {
  // Generar grid de espacios de estacionamiento con espaciado correcto para las rejas
  const generateParkingSpaces = (): ParkingSpace[] => {
    const spaces: ParkingSpace[] = []
    const spaceWidth = 80
    const spaceHeight = 40
    const spacing = 20
    const barrierHeight = 20 // Espacio que ocupa cada reja + margen

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const id = row * gridCols + col + 1
        const x = col * (spaceWidth + spacing) + 30

        // Calcular Y considerando las rejas
        let y = 30 // Posición inicial

        if (row < 2) {
          // Sección A (filas 0-1): posición normal
          y += row * (spaceHeight + spacing)
        } else if (row < 4) {
          // Sección B (filas 2-3): después de la primera reja
          y += 2 * (spaceHeight + spacing) + barrierHeight
          y += (row - 2) * (spaceHeight + spacing)
        } else {
          // Sección C (filas 4-5): después de ambas rejas
          y += 2 * (spaceHeight + spacing) + barrierHeight // Primera sección + reja 1
          y += 2 * (spaceHeight + spacing) + barrierHeight // Segunda sección + reja 2
          y += (row - 4) * (spaceHeight + spacing)
        }

        spaces.push({
          id,
          x,
          y,
          width: spaceWidth,
          height: spaceHeight,
          occupied: false,
        })
      }
    }

    return spaces
  }

  // Generar espacios
  const parkingSpaces = generateParkingSpaces()

  // Calcular altura necesaria del SVG basándose en los espacios
  const maxY = Math.max(...parkingSpaces.map((space) => space.y + space.height))
  const svgHeight = maxY + 50 // Agregar margen inferior

  // Función para determinar si un espacio está ocupado basado en las predicciones REALES
  const checkSpaceOccupancy = (
    space: ParkingSpace,
    predictions: Prediction[],
  ): { occupied: boolean; confidence?: number; prediction?: Prediction } => {
    for (const prediction of predictions) {
      const predictionCenterX = (prediction.x1 + prediction.x2) / 2
      const predictionCenterY = (prediction.y1 + prediction.y2) / 2

      // Verificar si el centro de la predicción está dentro del espacio de estacionamiento
      if (
        predictionCenterX >= space.x &&
        predictionCenterX <= space.x + space.width &&
        predictionCenterY >= space.y &&
        predictionCenterY <= space.y + space.height
      ) {
        return { occupied: true, confidence: prediction.confidence, prediction }
      }
    }
    return { occupied: false }
  }

  // Aplicar las predicciones REALES a los espacios
  const parkingSpacesWithOccupancy = parkingSpaces.map((space) => {
    const occupancy = checkSpaceOccupancy(space, notifications?.predictions || [])
    return {
      ...space,
      occupied: occupancy.occupied,
      confidence: occupancy.confidence,
      prediction: occupancy.prediction,
    }
  })

  const occupiedSpaces = parkingSpacesWithOccupancy.filter((space) => space.occupied).length
  const availableSpaces = totalSpaces - occupiedSpaces
  const occupancyRate = Math.round((occupiedSpaces / totalSpaces) * 100)

  // Calcular posiciones de las rejas basadas en los espacios reales
  const getBarrierPosition = (afterRow: number): number => {
    const spacesInRow = parkingSpacesWithOccupancy.filter((space) => Math.floor((space.id - 1) / gridCols) === afterRow)
    if (spacesInRow.length > 0) {
      return spacesInRow[0].y + 40 + 10 // Después del espacio + margen
    }
    return 0
  }

  const barrier1Y = getBarrierPosition(1) // Después de la fila 1 (índice 1)
  const barrier2Y = getBarrierPosition(3) // Después de la fila 3 (índice 3)

  // Estadísticas de debugging
  const totalPredictions = notifications?.predictions?.length || 0
  const predictionsWithoutSpace =
    notifications?.predictions?.filter((prediction) => {
      const predictionCenterX = (prediction.x1 + prediction.x2) / 2
      const predictionCenterY = (prediction.y1 + prediction.y2) / 2

      return !parkingSpaces.some(
        (space) =>
          predictionCenterX >= space.x &&
          predictionCenterX <= space.x + space.width &&
          predictionCenterY >= space.y &&
          predictionCenterY <= space.y + space.height,
      )
    }) || []

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Debug Info - Mostrar análisis de mapeo */}
      {notifications && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">📊 Análisis de Detecciones</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="font-medium">Total Predicciones:</p>
                  <p className="text-lg">{totalPredictions}</p>
                </div>
                <div>
                  <p className="font-medium">Espacios Ocupados:</p>
                  <p className="text-lg">{occupiedSpaces}</p>
                </div>
                <div>
                  <p className="font-medium">Predicciones Sin Mapear:</p>
                  <p className="text-lg">{predictionsWithoutSpace.length}</p>
                </div>
                <div>
                  <p className="font-medium">Eficiencia de Mapeo:</p>
                  <p className="text-lg">
                    {totalPredictions > 0 ? Math.round((occupiedSpaces / totalPredictions) * 100) : 0}%
                  </p>
                </div>
              </div>
              {predictionsWithoutSpace.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-red-600">⚠️ Predicciones fuera del área de estacionamiento:</p>
                  {predictionsWithoutSpace.map((pred, idx) => (
                    <p key={idx} className="text-xs">
                      Centro: ({Math.round((pred.x1 + pred.x2) / 2)}, {Math.round((pred.y1 + pred.y2) / 2)}) -
                      Confianza: {Math.round(pred.confidence * 100)}%
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Espacios</p>
                <p className="text-2xl font-bold">{totalSpaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Ocupados</p>
                <p className="text-2xl font-bold text-red-600">{occupiedSpaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-green-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">{availableSpaces}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Ocupación</p>
                <p className="text-2xl font-bold">{occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plano del Estacionamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Plano del Estacionamiento - Sector A</span>
            <Badge variant={occupancyRate > 80 ? "destructive" : occupancyRate > 60 ? "default" : "secondary"}>
              {occupancyRate}% Ocupado
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-50 rounded-lg p-4 overflow-x-auto">
            <svg
              width="700"
              height={svgHeight}
              viewBox={`0 0 700 ${svgHeight}`}
              className="border-2 border-gray-300 rounded bg-white"
            >
              {/* Líneas de referencia del estacionamiento */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Mostrar todas las predicciones como rectángulos semi-transparentes */}
              {notifications?.predictions?.map((prediction, index) => (
                <rect
                  key={`prediction-${index}`}
                  x={prediction.x1}
                  y={prediction.y1}
                  width={prediction.x2 - prediction.x1}
                  height={prediction.y2 - prediction.y1}
                  fill="rgba(255, 165, 0, 0.3)"
                  stroke="orange"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              ))}

              {/* Espacios de estacionamiento */}
              {parkingSpacesWithOccupancy.map((space) => (
                <g key={space.id}>
                  {/* Rectángulo del espacio */}
                  <rect
                    x={space.x}
                    y={space.y}
                    width={space.width}
                    height={space.height}
                    fill={space.occupied ? "#fee2e2" : "#f0fdf4"}
                    stroke={space.occupied ? "#dc2626" : "#16a34a"}
                    strokeWidth="2"
                    rx="4"
                  />

                  {/* Número del espacio */}
                  <text
                    x={space.x + space.width / 2}
                    y={space.y + space.height / 2 - 5}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill={space.occupied ? "#dc2626" : "#16a34a"}
                  >
                    {space.id}
                  </text>

                  {/* Icono de auto si está ocupado */}
                  {space.occupied && (
                    <>
                      <rect
                        x={space.x + 15}
                        y={space.y + space.height / 2 + 5}
                        width={space.width - 30}
                        height={15}
                        fill="#dc2626"
                        rx="7"
                      />
                      <text
                        x={space.x + space.width / 2}
                        y={space.y + space.height - 8}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#dc2626"
                      >
                        {space.confidence ? `${Math.round(space.confidence * 100)}%` : ""}
                      </text>
                    </>
                  )}
                </g>
              ))}

              {/* Rejas */}
              <g key="barrier-1">
                <rect x="20" y={barrier1Y} width="600" height="8" fill="#6b7280" rx="2" />
                <rect x="20" y={barrier1Y + 1} width="600" height="2" fill="#9ca3af" rx="1" />
                <rect x="20" y={barrier1Y + 5} width="600" height="2" fill="#4b5563" rx="1" />
                {Array.from({ length: 7 }, (_, postIndex) => (
                  <rect
                    key={`post-1-${postIndex}`}
                    x={20 + postIndex * 100}
                    y={barrier1Y - 2}
                    width="6"
                    height="12"
                    fill="#374151"
                    rx="3"
                  />
                ))}
              </g>

              <g key="barrier-2">
                <rect x="20" y={barrier2Y} width="600" height="8" fill="#6b7280" rx="2" />
                <rect x="20" y={barrier2Y + 1} width="600" height="2" fill="#9ca3af" rx="1" />
                <rect x="20" y={barrier2Y + 5} width="600" height="2" fill="#4b5563" rx="1" />
                {Array.from({ length: 7 }, (_, postIndex) => (
                  <rect
                    key={`post-2-${postIndex}`}
                    x={20 + postIndex * 100}
                    y={barrier2Y - 2}
                    width="6"
                    height="12"
                    fill="#374151"
                    rx="3"
                  />
                ))}
              </g>

              {/* Entrada del estacionamiento */}
              <rect x="10" y={svgHeight / 2 - 20} width="15" height="40" fill="#3b82f6" rx="2" />
              <text
                x="5"
                y={svgHeight / 2 + 5}
                fontSize="10"
                fill="#3b82f6"
                transform={`rotate(-90, 5, ${svgHeight / 2 + 5})`}
              >
                ENTRADA
              </text>
            </svg>
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span>Espacio Libre</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
              <span>Espacio Ocupado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Entrada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-gray-500 rounded"></div>
              <span>Reja Separadora</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-dashed bg-orange-100 opacity-50 rounded"></div>
              <span>Área de Detección</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detecciones Activas */}
      {notifications?.predictions && notifications.predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detecciones Activas ({notifications.predictions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {notifications.predictions.map((prediction, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Car className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">{prediction.class_name}</p>
                    <p className="text-sm text-gray-500">Confianza: {Math.round(prediction.confidence * 100)}%</p>
                    <p className="text-xs text-gray-400">
                      Centro: ({Math.round((prediction.x1 + prediction.x2) / 2)},{" "}
                      {Math.round((prediction.y1 + prediction.y2) / 2)})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
