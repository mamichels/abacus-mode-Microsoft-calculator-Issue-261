function main() {
    let beadWidth = 40
    let beadHeight = 40
    let barHeight = 20
    let margin = { top: 60, right: 20, left: 20, bottom: 20, inbetween: 20 }
    let columns = 12
    let gRows = 4
    let width = columns * (beadWidth + margin.inbetween) + margin.left
    let height = (beadHeight + margin.inbetween) * 7  + barHeight + margin.top + margin.bottom
    let blueBeads = [0, 1, 2, 6, 7, 8]

    let abacusSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    let counter = document.createElement('div')
    
    counter.setAttribute('id', 'counter')
    counter.setAttribute('class', 'footer')
    abacusSVG.setAttribute('id', 'abacusSVG')
    abacusSVG.setAttribute('class', 'header')
    abacusSVG.setAttribute('height', height)
    abacusSVG.setAttribute('width', width)
    
    document.body.appendChild(abacusSVG)
    document.body.appendChild(counter)

    //Crossbar
    abacusSVG.innerHTML += `<rect id='crossbar' width='${width}' height='${barHeight}' x='0' y='${margin.top + (beadHeight) * 2 + margin.inbetween * 2}'></rect>`
    //Heaven beads
    for (let i = 0; i < columns; i++) {
        abacusSVG.innerHTML += `<rect id='hBead${i}' class='hBead bead' state='0' width='${beadWidth}' height='${beadHeight}' x='${i * (beadWidth + margin.inbetween) + margin.left}' y='${margin.top}'></rect>`
    }
    //Ground beads
    for (let i = 0; i < gRows; i++) {
        for (let n = 0; n < columns; n++) {
            abacusSVG.innerHTML += `<rect id='gBead${n}_${i}' class='gBead bead' state='0' width='${beadWidth}' height='${beadHeight}' x='${n * (beadWidth + margin.inbetween) + margin.left}' y='${(i + 1) * (beadHeight + margin.inbetween) + margin.top + (beadHeight) * 2 + margin.inbetween * 4}'></rect>`
        }
    }

    let beads = document.getElementsByClassName('bead')
    let hBeads = document.getElementsByClassName('hBead')
    let gBeads = document.getElementsByClassName('gBead')

    //Coloring
    Array.from(beads).forEach(bead => {
        if (blueBeads.includes(parseInt(bead.id.toString().substring(5, 7)))) {
            bead.setAttribute('style', 'fill: rgb(52, 152, 219)')
        } else {
            bead.setAttribute('style', 'fill: rgb(240, 240, 240)')
        }
    })
    Array.from(hBeads).forEach(el => {
        el.addEventListener('click', moveHPosition)
    })
    Array.from(gBeads).forEach(el => {
        el.addEventListener('click', moveGPosition)
    })
    function moveHPosition(bead) {
        if (bead.target.getAttribute('state') == 0) {
            bead.target.setAttribute('y', `${parseInt(bead.target.getAttribute('y')) + (beadHeight + margin.inbetween)}`)
            bead.target.setAttribute('state', '1')
        } else {
            bead.target.setAttribute('y', `${parseInt(bead.target.getAttribute('y')) - (beadHeight + margin.inbetween)}`)
            bead.target.setAttribute('state', '0')
        }
        recountBeads()
    }
    function moveGPosition(bead) {
        let rowPosition = bead.target.id.toString()[bead.target.id.toString().length - 1]
        let beadAboveState
        let beadBelowState
        if (rowPosition < gRows - 1){
            let beadBelow = document.getElementById(bead.target.id.toString().slice(0, -1) + (parseInt(rowPosition) + 1))
            if (beadBelow.getAttribute('state') == 0){
                beadBelowState = true
            } else {
                beadBelowState = false
            }
        } else {
            beadBelowState = false
        }
        if (rowPosition > 0) {
            let beadAbove = document.getElementById(bead.target.id.toString().slice(0, -1) + (parseInt(rowPosition) - 1))
            if (beadAbove.getAttribute('state') == 1){
                beadAboveState = true
            } else {
                beadAboveState = false
            }
        } else {
            beadAboveState = false
        }
        if (bead.target.getAttribute('state') == 0 && (rowPosition == 0 || beadAboveState)) {
            bead.target.setAttribute('y', `${parseInt(bead.target.getAttribute('y')) - (beadHeight + margin.inbetween)}`)
            bead.target.setAttribute('state', '1')
        } else if (bead.target.getAttribute('state') == 1 && (beadBelowState || rowPosition == gRows - 1)) {
            bead.target.setAttribute('y', `${parseInt(bead.target.getAttribute('y')) + (beadHeight + margin.inbetween)}`)
            bead.target.setAttribute('state', '0')
        }
        recountBeads()
    }
    function recountBeads(){
        let counter = 0
        Array.from(hBeads).forEach(bead => {
            if (bead.getAttribute('state') == 1) {
                counter += 5
            }
        })
        Array.from(gBeads).forEach(bead => {
            if (bead.getAttribute('state') == 1) {
                counter += 1
            }
        })
        document.getElementById('counter').innerHTML = counter
    }
}