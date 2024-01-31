import React from 'react';

const App = () => {

    const urls = Array.from({ length: 10 }, (_, i) => `http://keymarket.uz/hack/olx/${i + 1}`);

    // Function to open each URL in a new tab
    function openUrlsInNewTabs() {
    urls.forEach((url) => {
        window.open(url, '_blank');
    });
    }

    // Call the function to open the URLs in new tabs
    openUrlsInNewTabs();

};

export default App;
