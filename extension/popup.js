document.getElementById('scrapeProfiles').addEventListener('click', () => {
    const links = document.getElementById('profileLinks').value.split(',');
  
    chrome.storage.local.set({ linkedinLinks: links }, () => {
      chrome.runtime.sendMessage({ action: 'scrapeLinkedInProfiles' });
    });
  });
  