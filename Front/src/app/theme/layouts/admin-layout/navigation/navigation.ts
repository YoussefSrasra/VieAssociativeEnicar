export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'utilities',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'typography',
        title: 'Typography',
        type: 'item',
        classes: 'nav-item',
        url: '/typography',
        icon: 'font-size'
      },
      {
        id: 'enrollment',
        title: 'demandes inscription',
        type: 'item',
        classes: 'nav-item',
        url: '/enrollment',
       
      },
      
      /*{
        id: 'color',
        title: 'Colors',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'bg-colors'
      },*/
      
    
      {
        id: 'color',
        title: 'creation de club',
        type: 'item',
        classes: 'nav-item',
        url: '/demandeclubadmin',
        icon: 'bg-colors'
      },
      {
        id: 'event launcher ',
        title: 'lancer event ',
        type: 'item',
        classes: 'nav-item',
        url: '/event-launch',
        icon: 'bg-colors'
      },
      {
        id: 'event suivi ',
        title: 'suivi event ',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event-registrations',
        icon: 'bg-colors'
      },
      {
        id: 'demande evenet  ',
        title: 'demande event club ',
        type: 'item',
        classes: 'nav-item',
        url: '/event-requests',
        icon: 'bg-colors'
      },
      {
        id: 'suivi demande evenet  ',
        title: 'suivi demande event club ',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event-requests',
        icon: 'bg-colors'
      },
      {
        id: 'partnerships  ',
        title: 'partnerships ',
        type: 'item',
        classes: 'nav-item',
        url: '/partnerships',
        icon: 'bg-colors'
      },
      {
        id: 'list partnerships  ',
        title: 'list partnerships ',
        type: 'item',
        classes: 'nav-item',
        url: '/partnership-list',
        icon: 'bg-colors'
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://ant.design/components/icon',
        icon: 'ant-design',
        target: true,
        external: true
      }

    ]
  },

  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Document',
        type: 'item',
        classes: 'nav-item',
        url: 'https://codedthemes.gitbook.io/mantis-angular/',
        icon: 'question',
        target: true,
        external: true
      }
    ]
  }
];
