import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { createDashboardLink } from '@openmrs/esm-patient-common-lib';
import { dashboardMeta } from './dashboard.meta';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const backendDependencies = {
  'webservices.rest': '^2.2.0',
};

function setupOpenMRS() {
  const moduleName = '@openmrs/esm-patient-attachments-app';

  defineConfigSchema(moduleName, {});

  return {
    extensions: [
      {
        name: 'attachments-overview-widget',
        slot: dashboardMeta.slot,
        load: getAsyncLifecycle(() => import('./attachments/attachments-overview.component'), {
          featureName: 'patient-attachments',
          moduleName,
        }),
        meta: {
          columnSpan: 1,
        },
      },
      {
        name: 'capture-photo-widget',
        slot: 'capture-patient-photo-slot',
        load: getAsyncLifecycle(() => import('./attachments/capture-photo.component'), {
          featureName: 'capture-photo-widget',
          moduleName,
        }),
      },
      {
        name: 'attachments-results-summary-dashboard',
        slot: 'patient-chart-dashboard-slot',
        order: 9,
        load: getSyncLifecycle(createDashboardLink(dashboardMeta), {
          featureName: 'attachments-dashboard-link',
          moduleName,
        }),
        meta: dashboardMeta,
      },
      {
        name: 'capture-photo-modal',
        load: getAsyncLifecycle(() => import('./attachments/camera-upload.component'), {
          featureName: 'capture-photo-modal',
          moduleName,
        }),
        online: true,
        offline: true,
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
