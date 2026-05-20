"""Seed script para insertar configuraciones por defecto del sistema.

Uso:
    python seed_config.py

Requiere tener la BD actualizada (alembic upgrade head) y el entorno configurado.
"""

import json
from sqlmodel import Session, create_engine, select
from features.admin.models import Configuracion


DEFAULT_CONFIGS = {
    "horarios_local": json.dumps(
        {
            "lunes": {
                "abierto": True,
                "turnos": [{"apertura": "08:00", "cierre": "15:00"}],
            },
            "martes": {
                "abierto": True,
                "turnos": [{"apertura": "08:00", "cierre": "15:00"}],
            },
            "miercoles": {
                "abierto": True,
                "turnos": [{"apertura": "08:00", "cierre": "15:00"}],
            },
            "jueves": {
                "abierto": True,
                "turnos": [{"apertura": "08:00", "cierre": "15:00"}],
            },
            "viernes": {
                "abierto": True,
                "turnos": [{"apertura": "08:00", "cierre": "15:00"}],
            },
            "sabado": {
                "abierto": True,
                "turnos": [{"apertura": "09:00", "cierre": "13:00"}],
            },
            "domingo": {"abierto": False, "turnos": []},
        },
        indent=2,
    ),
    "tiempo_preparacion_default": "15",
    "iva_porcentaje": "21",
    "costo_envio": "0",
}


def seed(session: Session):
    print("📦 Insertando configuraciones por defecto...")

    for clave, valor in DEFAULT_CONFIGS.items():
        existing = session.exec(
            select(Configuracion).where(Configuracion.clave == clave)
        ).first()

        if existing:
            print(f"  ↻  '{clave}' ya existe — se saltea")
        else:
            session.add(Configuracion(clave=clave, valor=valor))

    session.commit()
    print(f"✅ {len(DEFAULT_CONFIGS)} configuraciones insertadas.")


if __name__ == "__main__":
    import os

    database_url = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:root@localhost:3306/gestion3",
    )
    engine = create_engine(database_url)

    with Session(engine) as session:
        seed(session)
