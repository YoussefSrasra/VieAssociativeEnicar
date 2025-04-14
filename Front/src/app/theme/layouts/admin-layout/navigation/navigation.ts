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
  roles?: string[];
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
        breadcrumbs: false,
        roles: ['ADMIN','MANAGER','MEMBER']
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
        title: 'Liste des membres ',
        type: 'item',
        classes: 'nav-item',
        url: '/typography',
        
        roles: ['MANAGER']
      },
      {
        id: 'enrollment',
        title: 'Demandes inscription',
        type: 'item',
        classes: 'nav-item',
        url: '/enrollment',
        roles: ['MANAGER']
      },

      {
        id: 'entretiens',
        title: 'Entretiens',
        type: 'item',
        classes: 'nav-item',
        url: '/entretiens',
       
        roles: ['MANAGER']  
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
        title: 'Creation de club',
        type: 'item',
        classes: 'nav-item',
        url: '/demandeclubadmin',
        //icon: 'bg-colors',
        roles: ['ADMIN']
      
      },
      {
        id: 'event launcher ',
        title: 'Lancer un evenement ',
        type: 'item',
        classes: 'nav-item',
        url: '/event-launch',
        //icon: 'bg-colors',
        roles: ['ADMIN']
      },
      {
        id: 'event suivi ',
        title: 'Suivi evenement ',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event-registrations',
        //icon: 'bg-colors',
        roles: ['ADMIN']
      },
      {
        id: 'demande evenet  ',
        title: 'demandes evenement ',
        type: 'item',
        classes: 'nav-item',
        url: '/event-requests',
       // icon: 'bg-colors',
        roles: ['MANAGER']
      },
      {
        id: 'suivi demande evenet  ',
        title: 'Suivi des demandes ',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/event-requests',
       // icon: 'bg-colors',
        roles: ['ADMIN']
      },
      {
        id: 'partnerships  ',
        title: 'Partnerships ',
        type: 'item',
        classes: 'nav-item',
        url: '/partnerships',
        //icon: 'bg-colors',
        roles: ['ADMIN']  
      },
      {
        id: 'list partnerships  ',
        title: 'liste des partneraires ',
        type: 'item',
        classes: 'nav-item',
        url: '/partnership-list',
        //icon: 'bg-colors',
        roles: ['ADMIN']
      },
      {
        id: 'contacts-urgence  ',
        title: 'contacts-urgence ',
        type: 'item',
        classes: 'nav-item',
        url: '/contacts-urgence',
        //icon: 'bg-colors',
        roles: ['ADMIN']
      },
      {
        id: 'feedback-evenement  ',
        title: 'Feedback-evenement ',
        type: 'item',
        classes: 'nav-item',
        url: '/feedback-evenement',
        //icon: 'bg-colors',
        roles: ['MANAGER','MEMBER']
      },
      {
        id: 'feedback-list  ',
        title: 'feedback-list ',
        type: 'item',
        classes: 'nav-item',
        url: '/feedbacks',
        
        roles: ['ADMIN','MANAGER'],
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
      }//commentaire 

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
        //icon: 'question',
        target: true,
        external: true
      }
    ]
  }
];
