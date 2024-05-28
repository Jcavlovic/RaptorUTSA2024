function redirectToDeviceSpecificPage() {
    // Checking if the user agent of the browser matches 'iPad'
    if (navigator.userAgent.match(/iPad/i)) {
        // Redirect to a page designed for iPad
        window.location.href = '/ipad';
    } else {
        // Redirect to the desktop version
        window.location.href = '/startpage';
    }
}

// Call the function when the file is loaded
redirectToDeviceSpecificPage();