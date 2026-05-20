import type { ReactNode } from 'react'

type HelpContentMap = Record<string, ReactNode>

export const helpContent: HelpContentMap = {
  categorias: (
    <div className="space-y-3">
      <p>Administrá las <strong>categorías</strong> del menú de forma jerárquica.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Crear:</strong> Completá los campos del formulario. El slug se auto-genera si lo dejás vacío.</li>
        <li><strong>Jerarquía:</strong> Podés asignar una categoría padre para crear subcategorías.</li>
        <li><strong>Editar:</strong> Hacé clic en "Editar" sobre cualquier categoría para modificar sus datos.</li>
        <li><strong>Eliminar:</strong> Las categorías con subcategorías no se pueden eliminar directamente.</li>
      </ul>
    </div>
  ),

  ingredientes: (
    <div className="space-y-3">
      <p>Gestioná los <strong>ingredientes</strong> disponibles para los productos.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Crear:</strong> Definí nombre, unidad de medida y alérgenos asociados.</li>
        <li><strong>Unidades:</strong> unidad, gramo, kilogramo, mililitro, litro, cucharada, taza, porción.</li>
        <li><strong>Alérgenos:</strong> Indicá si el ingrediente contiene gluten, lactosa, huevo, soja, etc.</li>
        <li><strong>Disponibilidad:</strong> Podés desactivar un ingrediente sin eliminarlo.</li>
      </ul>
    </div>
  ),

  productos: (
    <div className="space-y-3">
      <p>Administrá los <strong>productos</strong> del menú con todas sus configuraciones.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Crear:</strong> Completá nombre, descripción, precio, stock y tiempo de preparación.</li>
        <li><strong>Categorías:</strong> Asigná una o más categorías al producto.</li>
        <li><strong>Ingredientes:</strong> Asigná ingredientes con cantidades específicas.</li>
        <li><strong>Stock:</strong> Podés asignar, incrementar o decrementar el stock manualmente.</li>
      </ul>
    </div>
  ),

  pedidos: (
    <div className="space-y-3">
      <p>Gestioná los <strong>pedidos</strong> del sistema y sus estados.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Estados:</strong> Cada pedido sigue un flujo: Pendiente → Confirmado → En Preparación → Listo → En Camino → Entregado.</li>
        <li><strong>Acciones:</strong> Los botones disponibles dependen del estado actual y tu rol.</li>
        <li><strong>Cancelación:</strong> Solo se puede cancelar en estados no terminales.</li>
        <li><strong>Roles:</strong> admin y cocinero pueden preparar; admin y repartidor pueden entregar.</li>
      </ul>
    </div>
  ),

  usuarios: (
    <div className="space-y-3">
      <p>Administrá los <strong>usuarios</strong> registrados en el sistema.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Roles:</strong> Podés asignar múltiples roles a cada usuario (admin, cocinero, repartidor, cliente).</li>
        <li><strong>Estado:</strong> Podés activar o desactivar usuarios. Los usuarios inactivos no pueden iniciar sesión.</li>
        <li><strong>Editar:</strong> Modificá nombre, teléfono y roles del usuario.</li>
      </ul>
    </div>
  ),

  config: (
    <div className="space-y-3">
      <p>Configurá los parámetros generales del <strong>sistema</strong>.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Valores:</strong> Modificá las configuraciones disponibles según las necesidades del negocio.</li>
        <li><strong>Guardar:</strong> Los cambios se aplican inmediatamente al guardar.</li>
      </ul>
    </div>
  ),
}
