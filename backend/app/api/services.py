from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.service import GovernmentService


router = APIRouter(
    prefix="/api/services",
    tags=["Government Services"],
)


@router.get("/")
def get_services(
    db: Session = Depends(get_db),
):
    services = (
        db.query(GovernmentService)
        .filter(
            GovernmentService.is_active == True
        )
        .all()
    )

    return services


@router.get("/{service_slug}")
def get_service(
    service_slug: str,
    db: Session = Depends(get_db),
):
    service = (
        db.query(GovernmentService)
        .filter(
            GovernmentService.slug == service_slug,
            GovernmentService.is_active == True,
        )
        .first()
    )

    if not service:
        raise HTTPException(
            status_code=404,
            detail="Service not found",
        )

    return service
