export const SERVER_PACKAGE = 'com.genymobile.scrcpy.Server';
export const SERVER_PORT = 8886;
export const SERVER_VERSION = '3.3.4';

export const LOG_LEVEL = 'DEBUG';

let SCRCPY_LISTENS_ON_ALL_INTERFACES;
/// #if SCRCPY_LISTENS_ON_ALL_INTERFACES
SCRCPY_LISTENS_ON_ALL_INTERFACES = true;
/// #else
SCRCPY_LISTENS_ON_ALL_INTERFACES = false;
/// #endif

// v3.3.4 uses key=value format for arguments
const ARGUMENTS = [
    SERVER_VERSION,
    `log_level=${LOG_LEVEL}`,
    `port_number=${SERVER_PORT}`,
    `listen_on_all_interfaces=${SCRCPY_LISTENS_ON_ALL_INTERFACES}`,
];

export const SERVER_PROCESS_NAME = 'app_process';

export const ARGS_STRING = `/ ${SERVER_PACKAGE} ${ARGUMENTS.join(' ')} 2>&1 > /dev/null`;
