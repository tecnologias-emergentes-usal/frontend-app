// Importación de componentes UI y tipos
import { Card, CardContent, CardHeader, CardTitle, Badge, Car, MapPin, Activity } from "@/components/basic-ui"
import type { Prediction, NotificationResponse } from "@/types/notifications"
import type { ParkingSpace } from "@/types/notifications"

// Definición de las props del componente principal
interface ParkingLotViewProps {
  notifications?: NotificationResponse | null
  totalSpaces?: number
  gridCols?: number
  gridRows?: number
}

// Mock data para pruebas o demostración visual, simula respuestas de detección
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

// Componente principal ParkingLotView
export default function ParkingLotView({
  notifications = mockNotifications,
  totalSpaces = 36,
  gridCols = 6,
  gridRows = 6,
}: ParkingLotViewProps) {

  /**
   * Genera un arreglo con la información de cada espacio de estacionamiento
   * incluyendo posición, dimensiones y separación por rejas/barriers.
   */
  const generateParkingSpaces = (): ParkingSpace[] => {
    const spaces: ParkingSpace[] = []
    const spaceWidth = 80
    const spaceHeight = 40
    const spacing = 20
    const barrierHeight = 20 // Alto extra para cada reja separadora

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const id = row * gridCols + col + 1
        const x = col * (spaceWidth + spacing) + 30

        // Calcula la posición vertical considerando las rejas según sección
        let y = 30 // Margen superior inicial

        if (row < 2) {
          // Sección A (primeras 2 filas), sin reja aún
          y += row * (spaceHeight + spacing)
        } else if (row < 4) {
          // Sección B (filas 2 y 3), después de la primera reja
          y += 2 * (spaceHeight + spacing) + barrierHeight
          y += (row - 2) * (spaceHeight + spacing)
        } else {
          // Sección C (filas 4 y 5), después de dos rejas
          y += 2 * (spaceHeight + spacing) + barrierHeight // Primer tramo + reja 1
          y += 2 * (spaceHeight + spacing) + barrierHeight // Segundo tramo + reja 2
          y += (row - 4) * (spaceHeight + spacing)
        }

        // Agrega el espacio al array
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

  // Genera la grilla de espacios
  const parkingSpaces = generateParkingSpaces()

  // Calcula el alto necesario para el SVG basado en la última fila más su altura
  const maxY = Math.max(...parkingSpaces.map((space) => space.y + space.height))
  const svgHeight = maxY + 50 // Deja margen inferior

  /**
   * Verifica si el centroide de una predicción cae dentro de los límites
   * de un espacio de estacionamiento determinado, marcándolo como ocupado si corresponde.
   */
  const checkSpaceOccupancy = (
    space: ParkingSpace,
    predictions: Prediction[],
  ): { occupied: boolean; confidence?: number } => {
    for (const prediction of predictions) {
      const predictionCenterX = (prediction.x1 + prediction.x2) / 2
      const predictionCenterY = (prediction.y1 + prediction.y2) / 2

      // Si el centroide cae dentro del rectángulo del espacio, lo marca como ocupado
      if (
        predictionCenterX >= space.x &&
        predictionCenterX <= space.x + space.width &&
        predictionCenterY >= space.y &&
        predictionCenterY <= space.y + space.height
      ) {
        return { occupied: true, confidence: prediction.confidence }
      }
    }
    return { occupied: false }
  }

  // Mapea cada espacio con su estado de ocupación según las predicciones actuales
  const parkingSpacesWithOccupancy = parkingSpaces.map((space) => {
    const occupancy = checkSpaceOccupancy(space, notifications?.predictions || [])
    return {
      ...space,
      occupied: occupancy.occupied,
      confidence: occupancy.confidence,
    }
  })

  // Estadísticas para los KPIs
  const occupiedSpaces = parkingSpacesWithOccupancy.filter((space) => space.occupied).length
  const availableSpaces = totalSpaces - occupiedSpaces
  const occupancyRate = Math.round((occupiedSpaces / totalSpaces) * 100)

  /**
   * Calcula la posición vertical (y) donde se dibuja una reja, según el índice de la fila después de la cual debe aparecer.
   */
  const getBarrierPosition = (afterRow: number): number => {
    const spacesInRow = parkingSpacesWithOccupancy.filter((space) => Math.floor((space.id - 1) / gridCols) === afterRow)
    if (spacesInRow.length > 0) {
      return spacesInRow[0].y + 40 + 10 // Al final del espacio, más un margen
    }
    return 0
  }

  // Posiciones verticales de las dos rejas separadoras
  const barrier1Y = getBarrierPosition(1) // Tras la fila 1
  const barrier2Y = getBarrierPosition(3) // Tras la fila 3

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Estadísticas rápidas de ocupación */}
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

      {/* Plano SVG visual del estacionamiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Plano del Estacionamiento - Sector A</span>
            {/* Badge de ocupación (cambia color según porcentaje) */}
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
              {/* Grid de fondo como referencia */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Dibuja cada espacio de estacionamiento */}
              {parkingSpacesWithOccupancy.map((space) => (
                <g key={space.id}>
                  {/* Rectángulo que representa el espacio */}
                  <rect
                    x={space.x}
                    y={space.y}
                    width={space.width}
                    height={space.height}
                    fill={space.occupied ? "#fee2e2" : "#f0fdf4"} // Color según ocupado/libre
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

                  {/* Icono y confianza si está ocupado */}
                  {space.occupied && (
                    <>
                      {/* Rectángulo como icono de auto */}
                      <rect
                        x={space.x + 15}
                        y={space.y + space.height / 2 + 5}
                        width={space.width - 30}
                        height={15}
                        fill="#dc2626"
                        rx="7"
                      />
                      {/* Porcentaje de confianza de la predicción */}
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

              {/* Dibuja las rejas/barriers separadoras */}
              {/* Reja 1 después de la fila 2 */}
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

              {/* Reja 2 después de la fila 4 */}
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
            </svg>
          </div>

          {/* Leyenda visual de colores y símbolos */}
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
              <div className="w-4 h-2 bg-gray-500 rounded"></div>
              <span>Reja Separadora</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de detecciones activas (autos detectados) */}
      {notifications?.predictions && notifications.predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detecciones Activas</CardTitle>
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
                      Pos: ({Math.round(prediction.x1)}, {Math.round(prediction.y1)})
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
