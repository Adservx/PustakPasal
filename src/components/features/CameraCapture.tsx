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
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })
            
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
        } catch (err) {
            console.error('Camera error:', err)
            setError('Unable to access camera. Please ensure camera permissions are granted.')
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
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50">
                <h2 className="text-white font-medium">Capture Book Cover</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20"
                >
                    <X className="h-6 w-6" />
                </Button>
            </div>

            {/* Camera View / Captured Image */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
                {error ? (
                    <div className="text-center text-white">
                        <p className="mb-4">{error}</p>
                        <Button onClick={() => startCamera()} variant="secondary">
                            Try Again
                        </Button>
                    </div>
                ) : capturedImage ? (
                    <img
                        src={capturedImage}
                        alt="Captured book cover"
                        className="max-h-full max-w-full object-contain rounded-lg"
                    />
                ) : (
                    <>
                        {isLoading && (
                            <div className="text-white">Starting camera...</div>
                        )}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`max-h-full max-w-full object-contain rounded-lg ${!stream ? 'hidden' : ''}`}
                        />
                    </>
                )}
                
                {/* Guide overlay for camera */}
                {stream && !capturedImage && (
                    <div className="absolute inset-4 pointer-events-none">
                        <div className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                            <p className="text-white/50 text-sm bg-black/50 px-3 py-1 rounded">
                                Position book cover within frame
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-black/50">
                {capturedImage ? (
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={retake}
                            variant="outline"
                            size="lg"
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                            <RotateCcw className="mr-2 h-5 w-5" />
                            Retake
                        </Button>
                        <Button
                            onClick={confirmCapture}
                            size="lg"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Check className="mr-2 h-5 w-5" />
                            Use This Photo
                        </Button>
                    </div>
                ) : stream ? (
                    <div className="flex justify-center items-center gap-4">
                        <Button
                            onClick={switchCamera}
                            variant="outline"
                            size="icon"
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 w-12"
                            title="Switch Camera"
                        >
                            <SwitchCamera className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={capturePhoto}
                            size="lg"
                            className="h-16 w-16 rounded-full bg-white hover:bg-gray-200"
                        >
                            <Camera className="h-8 w-8 text-black" />
                        </Button>
                        <div className="w-12" /> {/* Spacer for symmetry */}
                    </div>
                ) : null}
            </div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
