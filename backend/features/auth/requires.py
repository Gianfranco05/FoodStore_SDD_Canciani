from typing import Callable

from fastapi import Depends, HTTPException, status

from features.auth.dependencies import get_current_user
from features.auth.models import Usuario


def require_role(*roles: str) -> Callable:
    """
    Dependency factory para verificar roles del usuario.
    Uso: Depends(require_role("ADMIN", "STOCK"))
    """

    def check_role(
        current_user: Usuario = Depends(get_current_user),
    ) -> Usuario:
        if current_user.es_superadmin:
            return current_user
        
        if not hasattr(current_user, "roles") or not current_user.roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos necesarios",
            )
        
        user_role_names = []
        for ur in current_user.roles:
            if ur.rol:
                user_role_names.append(ur.rol.nombre)
        
        if not any(role in roles for role in user_role_names):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos necesarios",
            )
        
        return current_user

    return check_role