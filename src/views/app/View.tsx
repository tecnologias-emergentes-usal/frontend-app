import ParkingLotView from "./ParkingLotView";


export default function ParkingView() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Monitoreo de Estacionamiento</h1>
          <p className="text-gray-600">Visualización en tiempo real de espacios disponibles y ocupados</p>
        </div>

        <ParkingLotView />
      </div>
    </main>
  )
} 

