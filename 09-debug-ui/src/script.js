import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

// Debug
const gui = new GUI( {
    width: 300,
    title: 'Nice Debug UI',
    closeFolders: false
})
// gui.close()
// hide the debug gui
gui.hide()
window.addEventListener('keydown', (event) => {
    if (event.key == 'h') {
        console.log(gui._hidden)
        // use 'h' to toggle between hide and show
        gui.show(gui._hidden)
    }
})
const debugObject = {}
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#a778d8'
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Make the tweaks under same folder
const cubeTweaks = gui.addFolder('Awesome cube')
// cubeTweaks.close()
// method 1
// cubeTweaks.add(mesh.position, 'y', -3, 3, 0.01)
// method 2
cubeTweaks
    .add(mesh.position, 'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('elevation')
// Object visibility
cubeTweaks
    .add(mesh, 'visible')

// toggle the wireframe on/off
cubeTweaks
    .add(material, 'wireframe')
// toggle the color
cubeTweaks
    .addColor(debugObject, 'color')
    .onChange(() => {
        console.log('value has changed')
        // console.log(material.color)
        // console.log(value)
        // console.log(value.getHexString())
        material.color.set(debugObject.color)
    })
// not working
// let myVariable  = 1337
// gui.add(myVariable, '???')

// // it works
// const myObject = {
//     myVariable: 1337
// }
// gui.add(myObject, 'myVariable')

debugObject.spin = () => {
    gsap.to(mesh.rotation, {y: mesh.rotation.y + Math.PI * 2})
}
cubeTweaks.add(debugObject, 'spin')

debugObject.subdivision = 2
cubeTweaks
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(() => {
        console.log('subdivision changed')
        // remove the previous object
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1, 1, 1,
            debugObject.subdivision, debugObject.subdivision, debugObject.subdivision
        )
    })
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()