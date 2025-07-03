const backHome = () => window.location.href = '../index.html';

const buttons = document.querySelectorAll('.btn-logo');
const contents = document.querySelectorAll('.house-content');

buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('active-logo'));
        contents.forEach(content => content.classList.remove('active'));

        this.classList.add('active-logo');

        const house = this.dataset.house;
        const activeContent = document.querySelector(`.house-content[data-house="${house}"]`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
  const popup = document.createElement('div');
  popup.classList.add('hp-popup');
  popup.style.cssText = `
    font-family: Inter;
    position: absolute;
    background: #1d1d1d;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    font-size: 13px;
    z-index: 1000;
    display: none;
    max-width: 250px;
    height: 435px;
    overflow: hidden;
    line-height: 140%;
  `;
  document.body.appendChild(popup);

  fetch('https://hp-api.onrender.com/api/characters')
    .then(res => res.json())
    .then(data => {
      const arrows = document.querySelectorAll('.character-form__arrow-img');
      const listenersMap = new WeakMap();

      function addListeners() {
        arrows.forEach(arrow => {
          const old = listenersMap.get(arrow);
          if (old) {
            arrow.removeEventListener('mouseenter', old.mouseenter);
            arrow.removeEventListener('mouseleave', old.mouseleave);
            arrow.removeEventListener('click', old.click);
          }

          const container = arrow.closest('.character-form');
          const name = container.querySelector('h2 span')?.textContent?.trim()?.toLowerCase();
          const character = data.find(c => c.name.toLowerCase() === name);
          if (!character) return;

          const showPopup = () => {
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
            popup.style.top = window.scrollY + rect.bottom - 470 + 'px';
            popup.style.left = window.scrollX + rect.left - 139 + 'px';
            popup.style.display = 'block';
            popup.classList.add('show');
          };

          const hidePopup = () => {
            popup.classList.remove('show');
            // popup.style.display = 'none';
          };

          const handlers = {
            mouseenter: () => showPopup(),
            mouseleave: () => hidePopup(),
            click: (e) => {
              e.stopPropagation();
              if (popup.classList.contains('show')) {
                hidePopup();
              } else {
                showPopup();
              }
            }
          };

          if (window.innerWidth > 1280) {
            arrow.addEventListener('mouseenter', handlers.mouseenter);
            arrow.addEventListener('mouseleave', handlers.mouseleave);
            popup.addEventListener('mouseenter', handlers.mouseenter);
            popup.addEventListener('mouseleave', handlers.mouseleave);
          } else {
            arrow.addEventListener('click', handlers.click);

            document.addEventListener('click', (e) => {
              if (!popup.contains(e.target) && !arrow.contains(e.target)) {
                hidePopup();
              }
            });
          }

          listenersMap.set(arrow, handlers);
        });
      }

      addListeners();

      window.addEventListener('resize', () => {
        popup.style.display = 'none';
        popup.classList.remove('show');
        addListeners();
      });
    });
});