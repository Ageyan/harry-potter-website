const backHome = () => window.location.href = '../index.html';

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.createElement('div');
    popup.classList.add('hp-popup');
    popup.style.fontFamily = 'Inter';
    popup.style.position = 'absolute';
    popup.style.background = '#1d1d1d';
    popup.style.padding = '20px';
    popup.style.borderRadius = '20px';
    popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    popup.style.fontSize = '14px';
    popup.style.zIndex = '1000';
    popup.style.display = 'none';
    popup.style.maxWidth = '250px';
    popup.style.lineHeight = '140%';
    document.body.appendChild(popup);
  
    fetch('https://hp-api.onrender.com/api/characters')
      .then(res => res.json())
      .then(data => {
        document.querySelectorAll('.character-form__arrow-img').forEach(arrow => {
          const container = arrow.closest('.character-form');
          const name = container.querySelector('h2 span')?.textContent?.trim()?.toLowerCase();
          const character = data.find(c => c.name.toLowerCase() === name);
  
          if (!character) return;
  
          arrow.addEventListener('mouseenter', () => {
            popup.innerHTML = `
              <strong>Name:</strong> ${character.name}<br>
              <strong>Alternate names:</strong> ${Array.isArray(character.alternate_names) && character.alternate_names.length ? character.alternate_names.join(', ') : '—'}<br>
              <strong>Species:</strong> ${character.species || '—'}<br>
              <strong>Gender:</strong> ${character.gender || '—'}<br>
              <strong>House:</strong> ${character.house || '—'}<br>
              <strong>Date of birth:</strong> ${character.dateOfBirth || '—'}<br>
              <strong>Year of birth:</strong> ${character.yearOfBirth || '—'}<br>
              <strong>Wizard:</strong> ${character.wizard ? 'True' : 'False'}<br>
              <strong>Ancestry:</strong> ${character.ancestry || '—'}<br>
              <strong>Eye colour:</strong> ${character.eyeColour || '—'}<br>
              <strong>Hair colour:</strong> ${character.hairColour || '—'}<br>
              <strong>Wand:</strong> 
                Wood: ${character.wand?.wood || '—'}, 
                Core: ${character.wand?.core || '—'}, 
                Length: ${character.wand?.length || '—'}<br>
              <strong>Patronus:</strong> ${character.patronus || '—'}<br>
              <strong>Hogwarts student:</strong> ${character.hogwartsStudent ? 'True' : 'False'}<br>
              <strong>Hogwarts staff:</strong> ${character.hogwartsStaff ? 'True' : 'False'}<br>
              <strong>Actor:</strong> ${character.actor || '—'}<br>
              <strong>Alive:</strong> ${character.alive ? 'True' : 'False'}
            `;
          
            const rect = arrow.getBoundingClientRect();
            popup.style.top = window.scrollY + rect.bottom + (-475) + 'px';
            popup.style.left = window.scrollX + rect.left + (-139) + 'px';
            popup.style.display = 'block';

            popup.classList.add('show');
          });
  
          arrow.addEventListener('mouseleave', () => {
            // popup.style.display = 'none';
            popup.classList.remove('show');
          });
        });
      });
});