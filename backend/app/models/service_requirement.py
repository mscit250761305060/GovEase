from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ServiceRequirement(Base):
    __tablename__ = "service_requirements"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    service_id: Mapped[int] = mapped_column(
        ForeignKey("government_services.id"),
        nullable=False,
        index=True,
    )

    requirement_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    field_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    label: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    input_type: Mapped[str] = mapped_column(
        String(50),
        default="text",
        nullable=False,
    )

    is_required: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    validation_rule: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
