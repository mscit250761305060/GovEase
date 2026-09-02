from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ServiceProofConfig(Base):
    __tablename__ = "service_proof_configs"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    service_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    proof_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    required_keywords: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    reference_image_path: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
