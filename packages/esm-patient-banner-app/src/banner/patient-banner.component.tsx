import React, { MouseEvent } from 'react';
import capitalize from 'lodash-es/capitalize';
import ChevronDown16 from '@carbon/icons-react/es/chevron--down/16';
import ChevronUp16 from '@carbon/icons-react/es/chevron--up/16';
import OverflowMenuVertical16 from '@carbon/icons-react/es/overflow-menu--vertical/16';
import ContactDetails from '../contact-details/contact-details.component';
import CustomOverflowMenuComponent from '../ui-components/overflow-menu.component';
import styles from './patient-banner.scss';
import { useTranslation } from 'react-i18next';
import { Button } from 'carbon-components-react';
import { ExtensionSlot, age, formatDate, parseDate } from '@openmrs/esm-framework';

interface PatientBannerProps {
  patient: fhir.Patient;
  patientUuid: string;
  onClick?: (patientUuid: string) => void;
  onTransition?: () => void;
  hideActionsOverflow?: boolean;
}

const PatientBanner: React.FC<PatientBannerProps> = ({
  patient,
  patientUuid,
  onClick,
  onTransition,
  hideActionsOverflow,
}) => {
  const { t } = useTranslation();
  const overFlowMenuRef = React.useRef(null);

  const patientActionsSlotState = React.useMemo(
    () => ({ patientUuid, onClick, onTransition }),
    [patientUuid, onClick, onTransition],
  );

  const patientName = `${patient.name?.[0].given?.join(' ')} ${patient?.name?.[0].family}`;
  const patientPhotoSlotState = React.useMemo(() => ({ patientUuid, patientName }), [patientUuid, patientName]);

  const [showContactDetails, setShowContactDetails] = React.useState(false);
  const toggleContactDetails = React.useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setShowContactDetails((value) => !value);
  }, []);

  const patientAvatar = (
    <div className={styles.patientAvatar} role="img">
      <ExtensionSlot extensionSlotName="patient-photo-slot" state={patientPhotoSlotState} />
    </div>
  );

  const handleNavigateToPatientChart = (event: MouseEvent) => {
    if (onClick) {
      !(overFlowMenuRef?.current && overFlowMenuRef?.current.contains(event.target)) && onClick(patientUuid);
    }
  };
  const [showDropdown, setShowDropdown] = React.useState(false);
  const closeDropdownMenu = React.useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setShowDropdown((value) => !value);
  }, []);

  return (
    <div className={styles.container} role="banner">
      <div
        onClick={handleNavigateToPatientChart}
        tabIndex={0}
        role="button"
        className={`${styles.patientBanner} ${onClick && styles.patientAvatarButton}`}
      >
        {patientAvatar}
        <div className={styles.patientInfo}>
          <div className={`${styles.row} ${styles.patientNameRow}`}>
            <div className={styles.flexRow}>
              <span className={styles.patientName}>{patientName}</span>
              <ExtensionSlot
                extensionSlotName="patient-banner-tags-slot"
                state={{ patientUuid, patient }}
                className={styles.flexRow}
              />
            </div>
            {!hideActionsOverflow && (
              <div ref={overFlowMenuRef}>
                <CustomOverflowMenuComponent
                  menuTitle={
                    <>
                      <span className={styles.actionsButtonText}>{t('actions', 'Actions')}</span>{' '}
                      <OverflowMenuVertical16 style={{ marginLeft: '0.5rem' }} />
                    </>
                  }
                  dropDownMenu={showDropdown}
                >
                  <ExtensionSlot
                    onClick={closeDropdownMenu}
                    extensionSlotName="patient-actions-slot"
                    key="patient-actions-slot"
                    className={styles.overflowMenuItemList}
                    state={patientActionsSlotState}
                  />
                </CustomOverflowMenuComponent>
              </div>
            )}
          </div>
          <div className={styles.demographics}>
            <span>{capitalize(patient.gender)}</span> &middot; <span>{age(patient.birthDate)}</span> &middot;{' '}
            <span>{formatDate(parseDate(patient.birthDate), { mode: 'wide', time: false })}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.identifiers}>
              {patient.identifier?.length ? patient.identifier.map((i) => i.value).join(', ') : '--'}
            </span>
            <Button
              kind="ghost"
              renderIcon={showContactDetails ? ChevronUp16 : ChevronDown16}
              iconDescription="Toggle contact details"
              onClick={toggleContactDetails}
              style={{ marginTop: '-0.25rem' }}
            >
              {showContactDetails ? t('showLess', 'Show less') : t('showAllDetails', 'Show all details')}
            </Button>
          </div>
        </div>
      </div>
      {showContactDetails && (
        <ContactDetails address={patient.address ?? []} telecom={patient.telecom ?? []} patientId={patient.id} />
      )}
    </div>
  );
};

export default PatientBanner;
