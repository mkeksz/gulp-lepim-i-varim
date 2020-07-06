{
  let button = document.querySelector('.header__drop-button'),
      drop_menu = document.querySelector('.header__drop-menu'),
      burger_button = document.querySelector('.header__burger-button'),
      burger_menu = document.querySelector('.header__burger-menu');

  button.addEventListener('click', function(){
    drop_menu.classList.toggle('header__drop-menu_show');
    event.stopPropagation();
  });

  burger_button.addEventListener('click', function(){
    burger_menu.classList.toggle('header__burger-menu_show');
    event.stopPropagation();
  });

  document.onclick = function(){
    drop_menu.classList.remove('header__drop-menu_show');
    burger_menu.classList.remove('header__burger-menu_show');
  };
}
