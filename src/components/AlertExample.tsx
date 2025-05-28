import React from "react";
import { Block, BlockTitle, Button } from "konsta/react";

export function AlertExample() {
  return (
    <Block>
      <BlockTitle>Alert Examples</BlockTitle>
      
      <div className="mb-4 p-4 rounded-lg bg-accent text-accent-foreground">
        <strong>Alerta de Notificación</strong>
        <p>Has recibido una nueva alerta de movimiento en tu cámara principal.</p>
      </div>
      
      <div className="mb-4 p-4 rounded-lg bg-primary text-primary-foreground">
        <strong>Alerta Importante</strong>
        <p>Tu sistema requiere una actualización de seguridad.</p>
      </div>
      
      <div className="mb-4 p-4 rounded-lg bg-card border border-secondary">
        <strong className="text-foreground">Información</strong>
        <p className="text-secondary">Tu dispositivo está conectado correctamente.</p>
      </div>
      
      <div className="flex space-x-2">
        <Button className="bg-primary text-primary-foreground">
          Acción Principal
        </Button>
        <Button className="bg-accent text-accent-foreground">
          Acción de Alerta
        </Button>
      </div>
    </Block>
  );
} 