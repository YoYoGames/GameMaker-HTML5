function gamepad_is_supported() {

    return g_pGamepadManager.IsSupported();
}

function gamepad_get_device_count() {

    return g_pGamepadManager.GetDeviceCount();
}

function gamepad_is_connected(_device) {

    return g_pGamepadManager.IsConnected(yyGetInt32(_device));    
}

function gamepad_get_button_threshold(_device) {

    return g_pGamepadManager.ButtonThreshold(yyGetInt32(_device));
}

function gamepad_set_button_threshold(_device, _threshold) {

    g_pGamepadManager.SetButtonThreshold(yyGetInt32(_device), yyGetReal(_threshold));
}

function gamepad_get_axis_deadzone(_device) {

    return g_pGamepadManager.AxisDeadzone(yyGetInt32(_device));
}

function gamepad_set_axis_deadzone(_device, _deadzone) {

    g_pGamepadManager.SetAxisDeadzone(yyGetInt32(_device), yyGetReal(_deadzone));
}

function gamepad_get_description(_device) {

    return g_pGamepadManager.GetDescription(yyGetInt32(_device));
}

function gamepad_button_count(_device) {

    return g_pGamepadManager.ButtonCount(yyGetInt32(_device));
}

function gamepad_button_check(_device, _buttonIndex) {

    return g_pGamepadManager.ButtonDown(yyGetInt32(_device), yyGetInt32(_buttonIndex));
}

function gamepad_button_check_pressed(_device, _buttonIndex) {

    return g_pGamepadManager.ButtonPressed(yyGetInt32(_device), yyGetInt32(_buttonIndex));
}

function gamepad_button_check_released(_device, _buttonIndex) {

    return g_pGamepadManager.ButtonReleased(yyGetInt32(_device), yyGetInt32(_buttonIndex));
}

function gamepad_button_value(_device, _buttonIndex) {

    return g_pGamepadManager.ButtonValue(yyGetInt32(_device), yyGetInt32(_buttonIndex));
}

function gamepad_axis_count(_device) {

    return g_pGamepadManager.AxisCount(yyGetInt32(_device));
}

function gamepad_axis_value(_device, _axisIndex) {

    return g_pGamepadManager.AxisValue(yyGetInt32(_device), yyGetInt32(_axisIndex));
}

function gamepad_set_vibration(_device, _leftMotor, _rightMotor) {
}

function gamepad_set_color(_device,_color){
}

function gamepad_set_colour(_device,_colour){
}

function gamepad_hat_count(_device){
    // RK :: HTML5 controllers do not expose hats
    return 0;
}

function gamepad_hat_value(_device, _index){
    // RK :: HTML5 controllers do not expose hats
    return 0;
}

function gamepad_remove_mapping(_device){
    // RK :: HTML5 controllers do not have any mapping functionality
}

function gamepad_test_mapping(_device, _mapping){
    // RK :: HTML5 controllers do not have any mapping functionality
}

function gamepad_get_mapping(_device) {
    // RK :: HTML5 controllers do not have any mapping functionality
    _device = yyGetInt32(_device);
    if ((_device < 0 ) || (_device >= g_pGamepadManager.GetDeviceCount()) ) {
        return "device index out of range";
    } // end if
    return "no mapping";
}

function gamepad_get_guid(_device){
    // RK :: HTML5 controllers do not have any mapping functionality
    _device = yyGetInt32(_device);
    if ((_device < 0 ) || (_device >= g_pGamepadManager.GetDeviceCount()) ) {
        return "device index out of range";
    } // end if
    return "none";
}

function gamepad_set_option() {

}

function gamepad_get_option() {
    return 0;
}



