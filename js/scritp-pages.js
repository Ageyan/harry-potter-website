const backHome = () => window.location.href = '../index.html';

const buttons = document.querySelectorAll('.btn-logo');
const contents = document.querySelectorAll('.house-content');

//Перебираємо кнопки лого та показуємо потрібний контент 
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
  // Створюємо tooltip, якщо його ще немає
  let tooltip = document.querySelector('.hp-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.classList.add('hp-tooltip');
    document.body.appendChild(tooltip);
  }

  let fetchFailed = false;

  fetch('https://hp-api.onrender.com/api/characters')
    .then(res => res.json())
    .then(data => {
      if (fetchFailed) return;

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
            tooltip.innerHTML = `
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
            tooltip.style.top = window.scrollY + rect.bottom - 470 + 'px';
            tooltip.style.left = window.scrollX + rect.left - 139 + 'px';
            tooltip.style.display = 'block';
            tooltip.classList.add('show');
          };

          const hidePopup = () => {
            tooltip.classList.remove('show');
          };

          const handlers = {
            mouseenter: () => {
              if (window.innerWidth > 1280) showPopup();
            },
            mouseleave: () => {
              if (window.innerWidth > 1280) hidePopup();
            },
            click: (e) => {
              if (window.innerWidth <= 1280) {
                e.stopPropagation();
                if (tooltip.classList.contains('show')) {
                  hidePopup();
                } else {
                  showPopup();
                }
              }
            }
          };

          if (window.innerWidth > 1280) {
            arrow.addEventListener('mouseenter', handlers.mouseenter);
            arrow.addEventListener('mouseleave', handlers.mouseleave);
          } else {
            arrow.addEventListener('click', handlers.click);
          }

          listenersMap.set(arrow, handlers);
        });
      }

      addListeners();

      window.addEventListener('resize', () => {
        tooltip.classList.remove('show');
        addListeners();
      });
    })
    .catch(error => {
      console.error('Помилка при завантаженні даних:', error);
      fetchFailed = true;
    });

  // Hover-поведінка при помилці (тільки для десктопу)
  document.addEventListener('mouseover', (e) => {
    if (!fetchFailed || window.innerWidth <= 1280) return;
    const arrow = e.target.closest('.character-form__arrow-img');
    if (!arrow) return;

    tooltip.innerHTML = "<strong>Не вдалося завантажити дані про персонажа. Перевірте наявність інтернет-з'єднання або спробуйте пізніше.</strong>";
    const rect = arrow.getBoundingClientRect();
    tooltip.style.top = window.scrollY + rect.bottom - 470 + 'px';
    tooltip.style.left = window.scrollX + rect.left - 139 + 'px';
    tooltip.style.fontSize = '16px';
    tooltip.style.display = 'block';
    tooltip.classList.add('show');
  });

  document.addEventListener('mouseout', (e) => {
    if (!fetchFailed || window.innerWidth <= 1280) return;
    const arrow = e.target.closest('.character-form__arrow-img');
    if (!arrow) return;
    tooltip.classList.remove('show');
  });

  // Click-поведінка при помилці (мобільна)
  document.addEventListener('click', (e) => {
    if (!fetchFailed || window.innerWidth > 1280) return;
    const arrow = e.target.closest('.character-form__arrow-img');
    const isTooltip = tooltip.contains(e.target);

    if (arrow) {
      if (tooltip.classList.contains('show')) {
        tooltip.classList.remove('show');
      } else {
        tooltip.innerHTML = "<strong>Не вдалося завантажити дані про персонажа. Перевірте наявність інтернет-з'єднання або спробуйте пізніше.</strong>";
        const rect = arrow.getBoundingClientRect();
        tooltip.style.top = window.scrollY + rect.bottom - 470 + 'px';
        tooltip.style.left = window.scrollX + rect.left - 139 + 'px';
        tooltip.style.fontSize = '14px';
        tooltip.style.display = 'block';
        tooltip.classList.add('show');
      }
    } else if (!isTooltip) {
      tooltip.classList.remove('show');
    }
  });

  // Універсальний глобальний клік — закриває tooltip при успішному fetch (мобільний)
  document.addEventListener('click', (e) => {
    if (fetchFailed || window.innerWidth > 1280) return;
    const isArrow = e.target.closest('.character-form__arrow-img');
    const isTooltip = tooltip.contains(e.target);
    if (!isArrow && !isTooltip && tooltip.classList.contains('show')) {
      tooltip.classList.remove('show');
    }
  });
});
