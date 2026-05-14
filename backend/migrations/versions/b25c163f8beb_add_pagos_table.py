"""add pagos table

Revision ID: a25c163f8beb
Revises: a25c163f8beb
Create Date: 2026-05-13 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'b25c163f8beb'
down_revision: Union[str, Sequence[str], None] = 'a25c163f8beb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('pagos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('pedido_id', sa.Integer(), nullable=False),
        sa.Column('forma_pago_id', sa.Integer(), nullable=False),
        sa.Column('monto', sa.Float(), nullable=False),
        sa.Column('estado', sa.String(length=20), nullable=False),
        sa.Column('mp_preference_id', sa.String(length=255), nullable=True),
        sa.Column('mp_init_point', sa.String(length=500), nullable=True),
        sa.Column('mp_payment_id', sa.Integer(), nullable=True),
        sa.Column('mp_merchant_order_id', sa.Integer(), nullable=True),
        sa.Column('mp_status', sa.String(length=50), nullable=True),
        sa.Column('mp_status_detail', sa.String(length=100), nullable=True),
        sa.Column('idempotency_key', sa.String(length=36), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['pedido_id'], ['pedidos.id'], ),
        sa.ForeignKeyConstraint(['forma_pago_id'], ['formas_pago.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('idempotency_key'),
        mysql_collate='utf8mb4_unicode_ci',
    )
    op.create_index('ix_pagos_pedido_id', 'pagos', ['pedido_id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_pagos_pedido_id', table_name='pagos')
    op.drop_table('pagos')
