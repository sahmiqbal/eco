import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { AnimationMixer } from 'three'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

import { useLanguage } from '@/lib/language'

const MODEL_URL = '/logo-animation.glb'

function LogoHeroModel() {
  const gltf = useLoader(GLTFLoader, MODEL_URL)
  const ref = useRef<any>(null)
  const mixer = useMemo(() => {
    if (gltf.animations.length === 0) return null
    return new AnimationMixer(gltf.scene)
  }, [gltf.animations, gltf.scene])

  useEffect(() => {
    if (!mixer || gltf.animations.length === 0) return

    const action = mixer.clipAction(gltf.animations[0], gltf.scene)
    action.play()

    return () => {
      action.stop()
      mixer.stopAllAction()
    }
  }, [mixer, gltf.animations, gltf.scene])

  useFrame((_, delta) => {
    if (mixer) {
      mixer.update(delta)
    } else if (ref.current) {
      ref.current.rotation.y += delta * 0.25
    }
  })

  return (
    <primitive
      ref={ref}
      object={gltf.scene}
      position={[0, -0.25, 0]}
      scale={[0.9, 0.9, 0.9]}
    />
  )
}

function Controls() {
  const { camera, gl } = useThree()
  const controls = useRef<any>(null)

  useEffect(() => {
    const orbit = new OrbitControls(camera, gl.domElement)
    orbit.enableZoom = true
    orbit.enablePan = false
    orbit.enableDamping = true
    orbit.dampingFactor = 0.1
    orbit.minDistance = 2.5
    orbit.maxDistance = 7
    orbit.autoRotate = false
    orbit.update()

    controls.current = orbit

    return () => {
      orbit.dispose()
    }
  }, [camera, gl.domElement])

  useFrame(() => {
    if (controls.current) {
      controls.current.update()
    }
  })

  return null
}

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          className="absolute inset-0 h-full w-full"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 4.5], fov: 35 }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[2, 3, 2]} intensity={1.1} />
          <directionalLight position={[-2, 1, -3]} intensity={0.35} />
          <Suspense fallback={null}>
            <LogoHeroModel />
            <Controls />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative container mx-auto px-4 max-w-6xl py-20 md:py-28">
        <div className="relative z-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6 lg:col-span-5 text-center md:text-left">
            <Badge className="bg-gold/90 text-gold-foreground mb-4 text-[11px] tracking-[0.32em] rounded-full px-3 py-1 inline-flex items-center">
              {t('heroBadge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 max-w-xl mx-auto md:mx-0">
              {t('heroTitleLine1')}
              <br />
              <span className="gold-text">{t('heroTitleLine2')}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-white/85 text-base md:text-lg leading-relaxed mb-8 md:max-w-none">
              {t('heroDescription')}
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-start">
              <Button variant="uiverse" size="lg" className="w-full rounded-full gap-2 shadow-lg sm:w-auto" asChild>
                <Link to="/shop">
                  {t('discoverPacks')} <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="uiverse" size="lg" className="w-full rounded-full gap-2 shadow-lg sm:w-auto" asChild>
                <Link to="/shop?category=individual">
                  {t('individualProducts')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:block md:col-span-6 lg:col-span-7" aria-hidden>
            {/* decorative spacing column to keep composition balanced */}
          </div>
        </div>
      </div>
    </section>
  )
}
