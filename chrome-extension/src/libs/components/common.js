  /* 消息提示 toast */
  export function Snackbar(text,type='info'){
    let snackbar = document.querySelector('#snackbar')
    if(!snackbar){
      snackbar = document.createElement('div')
      snackbar.id = 'snackbar'
      document.body.appendChild(snackbar)
    }
    // snackbar.className = "show";
    snackbar.classList.add('show',type)
    snackbar.innerText = text
    setTimeout(function(){ snackbar.classList.remove("show", type); }, 3000);
  }

  