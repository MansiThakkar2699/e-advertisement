import React, { useState, useRef } from 'react';

const AdBuilder = () => {
    const fileInputRef = useRef(null);
    const [adContent, setAdContent] = useState({
        headlineOne: '50% off on Beauty Products',
        headlineTwo: 'Supporting Sub-Headline',
        buttonText: 'Learn More',
        bgColor: '#ffffff',
        textColor: '#000000',
        media: null,
        mediaType: null,
        mediaSize: 300 // Initial width in pixels
    });

    // Default layout positions: Media at top, then Headlines, then Button
    const [positions, setPositions] = useState({
        media: { x: 0, y: 20 },
        head1: { x: 0, y: 240 },
        head2: { x: 0, y: 290 },
        button: { x: 0, y: 340 },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdContent((prev) => ({ ...prev, [name]: value }));
    };

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const type = file.type.startsWith('video') ? 'video' : 'image';
            const reader = new FileReader();
            reader.onloadend = () => {
                setAdContent((prev) => ({ ...prev, media: reader.result, mediaType: type }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Improved Drag Logic to fix the "jumping" behavior seen in your video
    const handleDrag = (e, element) => {
        if (e.clientX === 0 && e.clientY === 0) return;

        // Use the bounding box of the canvas to calculate relative position
        const canvas = e.currentTarget.parentElement.getBoundingClientRect();
        const x = e.clientX - canvas.left - 50;
        const y = e.clientY - canvas.top - 20;

        setPositions(prev => ({
            ...prev,
            [element]: { x, y }
        }));
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar Controls */}
            <div className="w-1/3 bg-white p-8 shadow-xl z-10 overflow-y-auto border-r">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Ad Designer</h2>

                <div className="space-y-6">
                    {/* Media Upload and Size Control */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Media Controls</label>
                        <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" ref={fileInputRef} />
                        <button onClick={() => fileInputRef.current.click()} className="w-full py-2 mb-3 bg-white border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-all">
                            {adContent.media ? 'Replace Media' : 'Upload Image/Video'}
                        </button>

                        <label className="block text-xs font-medium text-gray-500 mb-1">Adjust Media Size</label>
                        <input
                            type="range" min="100" max="500"
                            value={adContent.mediaSize}
                            onChange={(e) => setAdContent(prev => ({ ...prev, mediaSize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline 1</label>
                        <input type="text" name="headlineOne" value={adContent.headlineOne} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Headline 2</label>
                        <input type="text" name="headlineTwo" value={adContent.headlineTwo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">BG Color</label>
                            <input type="color" name="bgColor" value={adContent.bgColor} onChange={handleChange} className="w-full h-10 rounded-md cursor-pointer border shadow-sm" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                            <input type="color" name="textColor" value={adContent.textColor} onChange={handleChange} className="w-full h-10 rounded-md cursor-pointer border shadow-sm" />
                        </div>
                    </div>

                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-transform active:scale-95 shadow-lg">
                        Save & Set Targeting
                    </button>
                </div>
            </div>

            {/* Preview Canvas */}
            <div className="w-2/3 flex flex-col items-center justify-center p-12 bg-gray-200">
                <p className="text-gray-400 mb-4 text-xs font-bold tracking-widest uppercase">Reposition any element by dragging</p>

                <div
                    className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transition-all duration-300 overflow-hidden"
                    style={{ backgroundColor: adContent.bgColor, color: adContent.textColor, minHeight: '600px' }}>

                    {/* Draggable Media Layer with Adjustable Size */}
                    <div
                        draggable
                        onDrag={(e) => handleDrag(e, 'media')}
                        className="absolute cursor-move z-10 transition-shadow hover:shadow-outline"
                        style={{
                            transform: `translate(${positions.media.x}px, ${positions.media.y}px)`,
                            width: `${adContent.mediaSize}px`
                        }}
                    >
                        {adContent.media ? (
                            <div className="rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-400">
                                {adContent.mediaType === 'video' ? (
                                    <video src={adContent.media} controls className="w-full h-full" />
                                ) : (
                                    <img src={adContent.media} alt="Ad Creative" className="w-full h-full object-contain" />
                                )}
                            </div>
                        ) : (
                            <div className="h-40 w-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 italic rounded-lg">
                                No Media Selected
                            </div>
                        )}
                    </div>

                    {/* Draggable Headline 1 */}
                    <h1
                        draggable
                        onDrag={(e) => handleDrag(e, 'head1')}
                        className="absolute text-4xl font-extrabold cursor-move select-none z-20 hover:bg-blue-50/50 p-2 rounded"
                        style={{ transform: `translate(${positions.head1.x}px, ${positions.head1.y}px)`, color: adContent.textColor }}>
                        {adContent.headlineOne}
                    </h1>

                    {/* Draggable Headline 2 */}
                    <h2
                        draggable
                        onDrag={(e) => handleDrag(e, 'head2')}
                        className="absolute text-xl font-medium cursor-move select-none z-20 hover:bg-blue-50/50 p-2 rounded"
                        style={{ transform: `translate(${positions.head2.x}px, ${positions.head2.y}px)`, color: adContent.textColor }}
                    >
                        {adContent.headlineTwo}
                    </h2>

                    {/* Draggable Action Button */}
                    <div
                        draggable
                        onDrag={(e) => handleDrag(e, 'button')}
                        className="absolute z-30 cursor-move p-2"
                        style={{ transform: `translate(${positions.button.x}px, ${positions.button.y}px)` }}
                    >
                        <button
                            className="px-8 py-3 rounded-full font-bold shadow-lg pointer-events-none whitespace-nowrap"
                            style={{ backgroundColor: adContent.textColor, color: adContent.bgColor }}>
                            {adContent.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdBuilder;