'use client'

import { useState } from 'react'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    images: string[]
    onImagesChange: (images: string[]) => void
    maxImages?: number
}

export default function ImageUpload({
    images,
    onImagesChange,
    maxImages = 5
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Reset error
        setError('')

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (PNG, JPG, JPEG, WebP)')
            return
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB')
            return
        }

        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await res.json()

            if (res.ok && data.success) {
                // Add new image URL to the list
                onImagesChange([...images, data.url])
            } else {
                setError(data.error || 'Upload failed. Please try again.')
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError('Upload failed. Please check your connection.')
        } finally {
            setUploading(false)
            // Reset file input
            e.target.value = ''
        }
    }

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index))
    }

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        onImagesChange(newImages)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                    Product Images
                </label>
                <span className="text-xs text-gray-400">
                    {images.length} / {maxImages} images
                </span>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div
                            key={index}
                            className="relative group aspect-square rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50"
                        >
                            <img
                                src={url}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Primary badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                    Primary
                                </div>
                            )}

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Move buttons */}
                            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index - 1)}
                                        className="flex-1 bg-gray-900 text-white text-xs py-1 rounded-lg hover:bg-black transition"
                                    >
                                        ←
                                    </button>
                                )}
                                {index < images.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index + 1)}
                                        className="flex-1 bg-gray-900 text-white text-xs py-1 rounded-lg hover:bg-black transition"
                                    >
                                        →
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {images.length < maxImages && (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-primary/50 transition">
                    <input
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <div className="flex flex-col items-center">
                        {uploading ? (
                            <>
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                                <span className="text-sm text-gray-600 font-medium">Uploading...</span>
                                <span className="text-xs text-gray-400 mt-1">Please wait</span>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-sm text-gray-700 font-bold">Click to upload image</span>
                                <span className="text-xs text-gray-500 mt-1">PNG, JPG, WebP (max 5MB)</span>
                            </>
                        )}
                    </div>
                </label>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <X className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Help Text */}
            {images.length === 0 && !error && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                    <ImageIcon className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold mb-1">Tips for great product photos:</p>
                        <ul className="text-xs space-y-1 text-blue-600">
                            <li>• Use good lighting and clean backgrounds</li>
                            <li>• First image will be the primary display image</li>
                            <li>• Add multiple angles for better customer view</li>
                            <li>• Recommended size: 800x800px or larger</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
