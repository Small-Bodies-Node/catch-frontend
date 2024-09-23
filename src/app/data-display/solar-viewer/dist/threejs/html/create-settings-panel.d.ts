export declare const settingsPanelIdX: string;
export declare const maxObjectsContainerDivId: string;
export declare const thresholdHContainerDivId: string;
/**
 * Create panel to hold all the buttons/fields that will control the widget's
 * local-storage-persisted state
 */
export declare const createSettingsPanel: () => {
    toggleSettingsPanelCb: () => void;
    settingsPanelDiv: HTMLDivElement;
};
