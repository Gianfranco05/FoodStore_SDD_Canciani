"""Seed scripts for FoodStore database"""
from database import get_session
from features.auth.models import Rol
from features.orders.models import EstadoPedido
from features.payments.models import FormaPago

def seed_roles():
    """Create default roles"""
    roles = [
        {"nombre": "admin", "descripcion": "Administrador del sistema"},
        {"nombre": "cliente", "descripcion": "Cliente regular"},
        {"nombre": "repartidor", "descripcion": "Repartidor de pedidos"},
        {"nombre": "cocinero", "descripcion": "Personal de cocina"},
    ]
    
    with get_session() as session:
        for rol_data in roles:
            existing = session.query(Rol).filter_by(nombre=rol_data["nombre"]).first()
            if not existing:
                rol = Rol(**rol_data)
                session.add(rol)
                print(f"  -> Created role: {rol_data['nombre']}")
            else:
                print(f"  -> Role already exists: {rol_data['nombre']}")
        session.commit()
    print("[OK] Roles seeded successfully!")


def seed_estados_pedido():
    """Create default order states"""
    estados = [
        {"nombre": "pendiente", "descripcion": "Pedido recibido, esperando confirmacion", "orden": 1},
        {"nombre": "confirmado", "descripcion": "Pedido confirmado por el restaurante", "orden": 2},
        {"nombre": "en_preparacion", "descripcion": "Pedido en cocina", "orden": 3},
        {"nombre": "listo_para_entrega", "descripcion": "Pedido listo para ser recogido/entregado", "orden": 4},
        {"nombre": "en_camino", "descripcion": "Pedido en camino (repartidor)", "orden": 5},
        {"nombre": "entregado", "descripcion": "Pedido entregado al cliente", "orden": 6},
        {"nombre": "cancelado", "descripcion": "Pedido cancelado", "orden": 7},
    ]
    
    with get_session() as session:
        for estado_data in estados:
            existing = session.query(EstadoPedido).filter_by(nombre=estado_data["nombre"]).first()
            if not existing:
                estado = EstadoPedido(**estado_data)
                session.add(estado)
                print(f"  -> Created estado: {estado_data['nombre']}")
            else:
                print(f"  -> Estado already exists: {estado_data['nombre']}")
        session.commit()
    print("[OK] Estados de pedido seeded successfully!")


def seed_formas_pago():
    """Create default payment methods"""
    formas = [
        {"nombre": "efectivo", "descripcion": "Pago en efectivo al recibir", "icono": "cash", "activo": True},
        {"nombre": "tarjeta", "descripcion": "Pago con tarjeta de credito/debito", "icono": "card", "activo": True},
        {"nombre": "transferencia", "descripcion": "Transferencia bancaria", "icono": "bank", "activo": True},
        {"nombre": "mercado_pago", "descripcion": "Pago via Mercado Pago", "icono": "mercado-pago", "activo": True},
    ]
    
    with get_session() as session:
        for forma_data in formas:
            existing = session.query(FormaPago).filter_by(nombre=forma_data["nombre"]).first()
            if not existing:
                forma = FormaPago(**forma_data)
                session.add(forma)
                print(f"  -> Created forma de pago: {forma_data['nombre']}")
            else:
                print(f"  -> Forma de pago already exists: {forma_data['nombre']}")
        session.commit()
    print("[OK] Formas de pago seeded successfully!")


def run_all_seeds():
    """Run all seed functions"""
    print("Starting database seeding...")
    print("\n1. Seeding roles...")
    seed_roles()
    
    print("\n2. Seeding estados de pedido...")
    seed_estados_pedido()
    
    print("\n3. Seeding formas de pago...")
    seed_formas_pago()
    
    print("\n[OK] All seeds completed!")


if __name__ == "__main__":
    run_all_seeds()
