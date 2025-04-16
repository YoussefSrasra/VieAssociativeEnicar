import { NavigationItem } from './navigation';

export function filterNavigationByRole(items: NavigationItem[], userRoles: string[]): NavigationItem[] {
    return items
      .filter(item => {
        // Si aucun rôle n'est spécifié, l'item est visible par tous
        if (!item.roles || item.roles.length === 0) return true;
        // Sinon, vérifier si au moins un rôle de l'utilisateur est autorisé
        return item.roles.some(role => userRoles.includes(role));
      })
      .map(item => {
        // Filtrer récursivement les enfants
        if (item.children) {
          return {
            ...item,
            children: filterNavigationByRole(item.children, userRoles)
          };
        }
        return item;
      })
      // Supprimer les groupes qui n'ont plus d'enfants après filtrage
      .filter(item => item.type !== 'group' || (item.children && item.children.length > 0));
  }