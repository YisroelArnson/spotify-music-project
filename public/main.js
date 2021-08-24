// Date selector functions
//For this function to work, the class names and Ids must match this format. [month, range, all-time]-...
function navBarSelectDetector(option) {
    document.getElementById('month-button').className = 'button'
    document.getElementById('range-button').className = 'button'
    document.getElementById('all-time-button').className = 'button'

    

    document.getElementById(option+"-button").className = 'button button-active'


    var divsToHide = document.getElementsByClassName("select-element"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        if(divsToHide[i].classList.contains(option+"-select-groups")) {
            divsToHide[i].style.display = "block"; // depending on what you're doing
        } else {
            divsToHide[i].style.display = "none"; // depending on what you're doing
        }
    }
}