"""Add doctor_id to appointments

Revision ID: 61824be10234
Revises: 
Create Date: 2025-10-18 21:31:01.972351

"""
from typing import Sequence, Union
from datetime import date

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '61824be10234'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop old indexes and table if needed
    op.drop_index(op.f('ix_departments_id'), table_name='departments')
    op.drop_index(op.f('ix_departments_name'), table_name='departments')
    op.drop_table('departments')

    # Add new columns
    op.add_column('appointments', sa.Column('doctor_id', sa.Integer(), nullable=True))
    op.add_column('appointments', sa.Column('registrationDate', sa.Date(), nullable=True))
    op.add_column('appointments', sa.Column('visitDate', sa.Date(), nullable=False, server_default=sa.text(f"'{date.today()}'")))

    # Add foreign key
    op.create_foreign_key(None, 'appointments', 'doctors', ['doctor_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(None, 'appointments', type_='foreignkey')
    op.drop_column('appointments', 'visitDate')
    op.drop_column('appointments', 'registrationDate')
    op.drop_column('appointments', 'doctor_id')

    op.create_table(
        'departments',
        sa.Column('id', sa.INTEGER(), nullable=False),
        sa.Column('name', sa.VARCHAR(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_departments_name'), 'departments', ['name'], unique=True)
    op.create_index(op.f('ix_departments_id'), 'departments', ['id'], unique=False)
