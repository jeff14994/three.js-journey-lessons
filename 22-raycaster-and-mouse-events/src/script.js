import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// console.log(GLTFLoader)

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

// RayCaster
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

//axeshelper
const axesHelper = new THREE.AxesHelper(-5)
scene.add(axesHelper)


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

// Mouse
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    // console.log('mouse move')
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y =  - (event.clientY / sizes.height * 2 - 1)
    // console.log(mouse.x)
})
window.addEventListener('click', () => {
    if(currentIntersect) {
        console.log('click on a sphere')
        // console.log('object: ' + currentIntersect)
        // if(currentIntersect.object === object1) {
        //     console.log('click on object 1')
        //     // console.log(object1)
        // } else if(currentIntersect.object === object2) {
        //     console.log('click on object 2')
        // } else if(currentIntersect.object === object3) {
        //     console.log('click on object 3')
        // }
        
        // show the selected object
        switch(currentIntersect.object) {
            case object1:
                console.log('click on object 1')
                break
            case object2:
                console.log('click on object 2')
                break
            case object3:
                console.log('click on object 3')
                break
        }
    }
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

// Model
const gltfLoader = new GLTFLoader()

let model = null

gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        // console.log(gltf.scene)
        model = gltf.scene
        gltf.scene.position.y = -1.2
        scene.add(model)
    }
)

// Lights
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()
    
    // raycaster.set(rayOrigin, rayDirection)
    
    // const objectsToTest = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objectsToTest)

    

    // // console.log(intersects.length)
    // for (const object of objectsToTest) {
    //     object.material.color.set('#ff0000')
    // }
    // for(const intersect of intersects) {
    //     // console.log(intersect)
    //     intersect.object.material.color.set('#0000ff')
        
    // }

    // Cast a ray from camera
    raycaster.setFromCamera(mouse, camera)
    
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)

    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    for(const intersect of intersects) {
        // console.log(intersect)
        intersect.object.material.color.set('#0000ff')
    }
    // Check mouse enter and leave
    if(intersects.length) {
        // console.log('something being hovered')
        if(currentIntersect === null) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
        // console.log(currentIntersect)
    } else {
        // console.log('nothing being hovered')
        if(currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }
    
    // Test intersect with model
    if(model) {
        const modelIntersects = raycaster.intersectObject(model)
        // console.log(modelIntersects)
        if(modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }


    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()