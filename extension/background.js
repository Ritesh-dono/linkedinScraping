async function scrapeProfileData(links, index = 0) {
  if (index >= links.length) {
      console.log('All profiles scraped.');
      
      return;
  }

  chrome.tabs.create({ url: links[index], active: false }, (tab) => {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: extractProfileInfo
      }, (results) => {
          if (chrome.runtime.lastError) {
              console.error('Script injection failed:', chrome.runtime.lastError);
              chrome.tabs.remove(tab.id);
              scrapeProfileData(links, index + 1);
              return;
          }  
          

          const profileData = results[0]?.result;
          if (!profileData) {
              console.error('No profile data found');
              chrome.tabs.remove(tab.id);
              scrapeProfileData(links, index + 1);
              return;
          }

          sendProfileDataToAPI(profileData)
              .then(() => {
                 
                  chrome.tabs.remove(tab.id);
                  
                  scrapeProfileData(links, index + 1);
              })
              .catch(error => {
                  console.error('Error sending profile data:', error);
                  chrome.tabs.remove(tab.id);
                  scrapeProfileData(links, index + 1);
              });
      });
  });
}


async function sendProfileDataToAPI(profileData) {
  try {
      const response = await fetch('http://localhost:3000/api/profiles', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileData)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile saved:', data);
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

function extractProfileInfo() {
  const name = document.querySelector('.text-heading-xlarge')?.innerText || '';
  const location = document.querySelector('.text-body-small.inline')?.innerText || '';
  const about = document.querySelector('.pv-about__summary-text')?.innerText || '';
  const bio = document.querySelector('.text-body-medium.break-words')?.innerText || '';
  const followerCount = parseInt(document.querySelector('.text-body-small .t-bold ')?.innerText.replace(/\D/g, ''),10) || 0;
  const connectionCount = parseInt(document.querySelector('.text-body small .t-bold')?.innerText.replace(/\D/g, ''),10) || 0;
  
  const url = window.location.href;
  return { name, location, about, bio, followerCount, connectionCount, url };

}



chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'scrapeLinkedInProfiles') {
      chrome.storage.local.get(['linkedinLinks'], (result) => {
          const links = result.linkedinLinks || [];
          scrapeProfileData(links);
      });
  }
});
