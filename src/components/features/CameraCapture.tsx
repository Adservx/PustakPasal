'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, X, RotateCcw, Check, SwitchCamera } from 'lucide-react'

interface CameraCaptureProps {
    onCapture: (imageDataUrl: string) => void
    onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
    const [isLoading, setIsLoading] = useState(true)

    // Start camera immediately when component mounts
    useEffect(() => {
        startCamera()
        return () => {
            // Cleanup on unmount
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const startCamera = useCallback(async (facing: 'user' | 'environment' = facingMode) => {
        setIsLoading(true)
        setError(null)

        // Stop existing stream if any
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facing,
                    width: { ideal: 1920 }, // Higher resolution preference
                    height: { ideal: 1080 }
                }
            })

            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err: unknown) {
            console.error('Camera error:', err)
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setError('Camera access denied. Please allow camera permissions in your browser settings and try again.')
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found. Please connect a camera and try again.')
                } else if (err.name === 'NotReadableError') {
                    setError('Camera is in use by another application. Please close other apps using the camera.')
                } else {
                    setError(`Camera error: ${err.message}`)
                }
            } else {
                setError('Unable to access camera. Please check your device settings.')
            }
        } finally {
            setIsLoading(false)
        }
    }, [stream, facingMode])

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }, [stream])

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (!context) return

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedImage(imageDataUrl)
        stopCamera()
    }, [stopCamera])

    const retake = useCallback(() => {
        setCapturedImage(null)
        setError(null)
        startCamera()
    }, [startCamera])

    const confirmCapture = useCallback(() => {
        if (capturedImage) {
            onCapture(capturedImage)
            onClose()
        }
    }, [capturedImage, onCapture, onClose])

    const switchCamera = useCallback(() => {
        const newFacing = facingMode === 'user' ? 'environment' : 'user'
        setFacingMode(newFacing)
        startCamera(newFacing)
    }, [facingMode, startCamera])

    const handleClose = useCallback(() => {
        stopCamera()
        onClose()
    }, [stopCamera, onClose])

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col h-[100dvh]">
            {/* Main Content Area - Full Screen */}
            <div className="relative flex-1 w-full h-full overflow-hidden bg-black">
                {/* Camera View / Captured Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {error ? (
                        <div className="text-center text-white p-4 z-20">
                            <p className="mb-4">{error}</p>
                            <Button onClick={() => startCamera()} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    ) : capturedImage ? (
                        <img
                            src={capturedImage}
                            alt="Captured book cover"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <>
                            {isLoading && (
                                <div className="absolute z-20 text-white flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mb-2"></div>
                                    <p>Starting camera...</p>
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-contain ${!stream ? 'hidden' : ''}`}
                            />
                        </>
                    )}
                </div>

                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/70 to-transparent pt-safe-top">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white font-medium drop-shadow-md">Capture Cover</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="text-white hover:bg-white/20 rounded-full"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Guide overlay (Center Reticle) - Only when active stream */}
                {stream && !capturedImage && !isLoading && (
                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                        <div className="w-64 h-64 border border-white/50 rounded-lg relative">
                            {/* Corner markers */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>

                            <p className="absolute -bottom-8 left-0 right-0 text-center text-white/80 text-sm shadow-black drop-shadow-md">
                                Position book in frame
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-black/80 to-transparent pb-safe-bottom">
                    {capturedImage ? (
                        <div className="flex justify-center gap-6">
                            <Button
                                onClick={retake}
                                variant="outline"
                                size="lg"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                            >
                                <RotateCcw className="mr-2 h-5 w-5" />
                                Retake
                            </Button>
                            <Button
                                onClick={confirmCapture}
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-900/20"
                            >
                                <Check className="mr-2 h-5 w-5" />
                                Use Photo
                            </Button>
                        </div>
                    ) : stream ? (
                        <div className="flex justify-between items-center max-w-sm mx-auto">
                            <Button
                                onClick={switchCamera}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-12 w-12 bg-black/20 backdrop-blur-sm"
                                title="Switch Camera"
                            >
                                <SwitchCamera className="h-6 w-6" />
                            </Button>

                            <Button
                                onClick={capturePhoto}
                                className="h-20 w-20 rounded-full bg-white hover:bg-gray-100 border-4 border-gray-300 p-0 shadow-lg transition-transform active:scale-95"
                            >
                                <div className="h-16 w-16 rounded-full border-2 border-black/10"></div>
                            </Button>

                            <div className="w-12" /> {/* Spacer for centering capture button */}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}

