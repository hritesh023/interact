import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { MessageCircle, Search, MoreVertical, Image as ImageIcon, Send, Paperclip, X, Smile, Sticker, Edit, Save, Trash2, RefreshCw, Palette, Maximize2, Minimize2 } from 'lucide-react';
import ImageEditor from './ImageEditor';
import { showSuccess, showError } from '@/utils/toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  messages?: Message[];
}

const ChatSidebar = () => {
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [themeColor, setThemeColor] = useState('0, 122, 255'); // RGB
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [tempBgImage, setTempBgImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // RGB slider states
  const [rgbValues, setRgbValues] = useState({
    r: 0,
    g: 122,
    b: 255
  });

  // Update RGB string when sliders change
  useEffect(() => {
    setThemeColor(`${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`);
    setHasUnsavedChanges(true);
  }, [rgbValues]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  // Load saved theme settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setThemeColor(theme.color || '0, 122, 255');
        setBgImage(theme.wallpaper || null);
        
        // Set RGB values from saved color
        const values = theme.color.split(',').map(v => parseInt(v.trim()));
        if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
          setRgbValues({ r: values[0], g: values[1], b: values[2] });
        }
      } catch (error) {
        console.error('Failed to load chat theme:', error);
      }
    }
  }, []);

  // Parse RGB string to values on mount and when themeColor changes externally
  useEffect(() => {
    const values = themeColor.split(',').map(v => parseInt(v.trim()));
    if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
      setRgbValues({ r: values[0], g: values[1], b: values[2] });
    }
  }, []);

  // Save theme settings to localStorage
  const saveThemeSettings = () => {
    const theme = {
      color: themeColor,
      wallpaper: bgImage
    };
    localStorage.setItem('chatTheme', JSON.stringify(theme));
    showSuccess('Chat theme saved successfully!');
    setHasUnsavedChanges(false);
  };

  // Discard unsaved changes
  const discardChanges = () => {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setThemeColor(theme.color || '0, 122, 255');
        setBgImage(theme.wallpaper || null);
        setTempBgImage(null);
        
        // Reset RGB values
        const values = theme.color.split(',').map(v => parseInt(v.trim()));
        if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
          setRgbValues({ r: values[0], g: values[1], b: values[2] });
        }
      } catch (error) {
        console.error('Failed to load chat theme:', error);
      }
    } else {
      // Reset to defaults
      setThemeColor('0, 122, 255');
      setBgImage(null);
      setTempBgImage(null);
      setRgbValues({ r: 0, g: 122, b: 255 });
    }
    setHasUnsavedChanges(false);
    showSuccess('Changes discarded');
  };

  // Handle RGB slider changes
  const handleRgbChange = (color: 'r' | 'g' | 'b', value: number[]) => {
    setRgbValues(prev => ({
      ...prev,
      [color]: value[0]
    }));
  };

  // Handle hex color input
  const handleHexInput = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setRgbValues({ r, g, b });
    }
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Mock sticker data
  const stickers = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
    '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤝', '🙏',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '🎉', '🎊', '🎈', '🎁', '🎀', '🎗️', '🎟️', '🎫', '🎖️', '🏆',
    '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐',
    '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏',
    '🎳', '🎯', '🎮', '🕹️', '🎰', '🧩', '🎪', '🎭', '🎨', '🎬'
  ];

  // Mock Data with messages
  const contacts: Contact[] = [
    { 
      id: '1', 
      name: 'Alice Chen', 
      avatar: 'https://github.com/shadcn.png', 
      lastMessage: 'Hey! Did you see the new moment?', 
      timestamp: '10:30 AM', 
      online: true,
      messages: [
        { id: '1', text: 'Hey! How are you?', sender: 'other', timestamp: '10:00 AM' },
        { id: '2', text: "I'm doing great, thanks for asking!", sender: 'user', timestamp: '10:05 AM' },
        { id: '3', text: 'Hey! Did you see the new moment?', sender: 'other', timestamp: '10:30 AM' },
      ]
    },
    { 
      id: '2', 
      name: 'Bob Smith', 
      avatar: 'https://github.com/shadcn.png', 
      lastMessage: 'The design looks great!', 
      timestamp: 'Yesterday', 
      online: false,
      messages: [
        { id: '1', text: 'Can you review my design?', sender: 'other', timestamp: 'Yesterday' },
        { id: '2', text: 'The design looks great!', sender: 'user', timestamp: 'Yesterday' },
      ]
    },
    { 
      id: '3', 
      name: 'Emma Wilson', 
      avatar: 'https://github.com/shadcn.png', 
      lastMessage: 'Can we call later?', 
      timestamp: 'Mon', 
      online: true,
      messages: [
        { id: '1', text: 'Are you free for a call?', sender: 'other', timestamp: 'Mon' },
        { id: '2', text: 'Can we call later?', sender: 'user', timestamp: 'Mon' },
      ]
    },
    { 
      id: '4', 
      name: 'David Park', 
      avatar: 'https://github.com/shadcn.png', 
      lastMessage: 'Sent a photo', 
      timestamp: 'Sun', 
      online: false,
      messages: [
        { id: '1', text: 'Check out this photo!', sender: 'other', timestamp: 'Sun', type: 'image', fileUrl: 'https://github.com/shadcn.png' },
        { id: '2', text: 'Sent a photo', sender: 'user', timestamp: 'Sun' },
      ]
    },
  ];

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize messages from contacts data
  useEffect(() => {
    const initialMessages: { [key: string]: Message[] } = {};
    contacts.forEach(contact => {
      if (contact.messages) {
        initialMessages[contact.id] = contact.messages;
      }
    });
    setMessages(initialMessages);
  }, []);

  // Handle sending messages
  const handleSendMessage = () => {
    if ((!message.trim() && !attachedFile) || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
      fileUrl: attachedFile ? URL.createObjectURL(attachedFile) : undefined,
      fileName: attachedFile ? attachedFile.name : undefined,
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    setMessage('');
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showSuccess('Message sent!');
  };

  // Handle file attachment
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
      }
      setAttachedFile(file);
      showSuccess(`${file.name} attached`);
    }
  };

  // Handle removing attached file
  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempBgImage(reader.result as string);
        setHasUnsavedChanges(true);
        showSuccess('Image uploaded! Click Edit to modify or Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEdited = (editedImageUrl: string) => {
    setTempBgImage(editedImageUrl);
    setHasUnsavedChanges(true);
    showSuccess('Image edited! Click Save to apply changes.');
  };

  const handleSaveWallpaper = () => {
    if (tempBgImage) {
      setBgImage(tempBgImage);
      saveThemeSettings();
    } else if (hasUnsavedChanges) {
      // Save color changes only
      saveThemeSettings();
    } else {
      showSuccess('No changes to save');
    }
  };

  const handleDiscardWallpaper = () => {
    setTempBgImage(null);
    discardChanges();
  };

  const handleRemoveWallpaper = () => {
    setTempBgImage(null);
    setBgImage(null);
    setHasUnsavedChanges(true);
    showSuccess('Wallpaper removed. Click Save to apply changes.');
  };

  const handleResetTheme = () => {
    setThemeColor('0, 122, 255');
    setBgImage(null);
    setTempBgImage(null);
    setRgbValues({ r: 0, g: 122, b: 255 });
    setHasUnsavedChanges(true);
    showSuccess('Theme reset to defaults. Click Save to apply.');
  };

  const handleRandomTheme = () => {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    setRgbValues({ r: randomR, g: randomG, b: randomB });
    setThemeColor(`${randomR}, ${randomG}, ${randomB}`);
    setHasUnsavedChanges(true);
    showSuccess('Random color generated! Click Save to apply.');
  };

  return (
    <div className="h-[calc(100vh-80px)] w-80 fixed right-4 top-24 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden hidden lg:flex flex-col z-40 transition-all hover:translate-x-0 translate-x-[calc(100%-60px)] hover:shadow-[0_0_50px_rgba(0,0,0,0.2)]" style={{ right: 0, transform: 'none' }}>
      {/* Note: In a real implementation, I'd make this toggleable or start closed on smaller screens. 
        For now simulating "Sidebar" behavior. I'll make it static for now as requested "add a side bar". 
        Actually replacing translate with a proper sidebar layout in HomePage might be better, but user asked for "side bar named chats". 
        I'll make it collapsible.
    */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" /> Chats
          </h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsFullscreen(true)}
              title="Expand to fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chat Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-4">
                  <Label>Theme Color (RGB Customizer)</Label>
                  
                  {/* RGB Sliders */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-red-600">Red</Label>
                        <span className="text-sm font-mono bg-red-100 px-2 py-1 rounded">{rgbValues.r}</span>
                      </div>
                      <Slider
                        value={[rgbValues.r]}
                        onValueChange={(value) => handleRgbChange('r', value)}
                        max={255}
                        step={1}
                        className="w-full"
                        style={{
                          '--slider-track-background': `linear-gradient(to right, rgb(0, ${rgbValues.g}, ${rgbValues.b}), rgb(255, ${rgbValues.g}, ${rgbValues.b}))`
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-green-600">Green</Label>
                        <span className="text-sm font-mono bg-green-100 px-2 py-1 rounded">{rgbValues.g}</span>
                      </div>
                      <Slider
                        value={[rgbValues.g]}
                        onValueChange={(value) => handleRgbChange('g', value)}
                        max={255}
                        step={1}
                        className="w-full"
                        style={{
                          '--slider-track-background': `linear-gradient(to right, rgb(${rgbValues.r}, 0, ${rgbValues.b}), rgb(${rgbValues.r}, 255, ${rgbValues.b}))`
                        } as React.CSSProperties}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-blue-600">Blue</Label>
                        <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">{rgbValues.b}</span>
                      </div>
                      <Slider
                        value={[rgbValues.b]}
                        onValueChange={(value) => handleRgbChange('b', value)}
                        max={255}
                        step={1}
                        className="w-full"
                        style={{
                          '--slider-track-background': `linear-gradient(to right, rgb(${rgbValues.r}, ${rgbValues.g}, 0), rgb(${rgbValues.r}, ${rgbValues.g}, 255))`
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>

                  {/* Color Preview and Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">RGB Value</Label>
                      <Input
                        value={`${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`}
                        onChange={(e) => {
                          const values = e.target.value.split(',').map(v => parseInt(v.trim()));
                          if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
                            setRgbValues({ r: values[0], g: values[1], b: values[2] });
                          }
                        }}
                        placeholder="0, 122, 255"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Hex Color</Label>
                      <div className="flex gap-1">
                        <Input
                          type="color"
                          value={rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b)}
                          onChange={(e) => handleHexInput(e.target.value)}
                          className="w-12 h-9 p-1 rounded"
                        />
                        <Input
                          value={rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b)}
                          onChange={(e) => handleHexInput(e.target.value)}
                          placeholder="#007AFF"
                          className="text-sm flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-border shadow-inner"
                      style={{ backgroundColor: `rgb(${themeColor})` }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preview</p>
                      <p className="text-xs text-muted-foreground">RGB({themeColor})</p>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div>
                    <Label className="text-xs text-muted-foreground">Quick Presets</Label>
                    <div className="grid grid-cols-6 gap-2 mt-2">
                      {[
                        { r: 0, g: 122, b: 255, name: 'Blue' },
                        { r: 255, g: 59, b: 48, name: 'Red' },
                        { r: 52, g: 199, b: 89, name: 'Green' },
                        { r: 255, g: 149, b: 0, name: 'Orange' },
                        { r: 175, g: 82, b: 222, name: 'Purple' },
                        { r: 255, g: 204, b: 0, name: 'Yellow' },
                        { r: 0, g: 0, b: 0, name: 'Black' },
                        { r: 142, g: 142, b: 147, name: 'Gray' },
                        { r: 255, g: 255, b: 255, name: 'White' },
                        { r: 255, g: 45, b: 85, name: 'Pink' },
                        { r: 0, g: 199, b: 190, name: 'Teal' },
                        { r: 88, g: 86, b: 214, name: 'Indigo' }
                      ].map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setRgbValues({ r: preset.r, g: preset.g, b: preset.b })}
                          className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: `rgb(${preset.r}, ${preset.g}, ${preset.b})` }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Chat Wallpaper</Label>
                  <div className="space-y-2">
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    
                    {/* Wallpaper Preview */}
                    {(tempBgImage || bgImage) && (
                      <div className="relative mt-2 w-full h-32 rounded-lg overflow-hidden border">
                        <img 
                          src={tempBgImage || bgImage} 
                          alt="Wallpaper preview" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-1 right-1 flex gap-1">
                          {tempBgImage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                              onClick={() => setShowImageEditor(true)}
                              title="Edit image"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                            onClick={handleRemoveWallpaper}
                            title="Remove wallpaper"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {hasUnsavedChanges && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDiscardWallpaper}
                        className="flex-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Discard
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveWallpaper}
                        className="flex-1"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  )}
                  
                  {/* Additional Theme Controls */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResetTheme}
                      className="flex-1"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRandomTheme}
                      className="flex-1"
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      Random
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">Supports Images & GIFs. Click Edit to crop/resize.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-8 bg-background/50" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {activeChat ? (
          <div className="flex flex-col h-full bg-muted/10 relative">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: (tempBgImage || bgImage) ? undefined : `rgba(${themeColor}, 0.05)`,
                backgroundImage: (tempBgImage || bgImage) ? `url(${tempBgImage || bgImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: (tempBgImage || bgImage) ? 1 : 0.1
              }}
            />
            {/* Chat Header */}
            <div className="p-3 border-b flex items-center gap-3 bg-secondary/30 backdrop-blur-md sticky top-0 z-10">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1 mr-1" onClick={() => setActiveChat(null)}>
                <X className="w-4 h-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeChat.avatar} />
                <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{activeChat.name}</p>
                <p className="text-xs text-muted-foreground">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages[activeChat.id]?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-white' : 'bg-secondary'} p-3 rounded-2xl ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm`}>
                    {msg.type === 'image' && msg.fileUrl ? (
                      <div className="space-y-2">
                        <img src={msg.fileUrl} alt="Shared image" className="max-w-full rounded-lg" />
                        {msg.text && <p>{msg.text}</p>}
                      </div>
                    ) : msg.type === 'file' && msg.fileUrl ? (
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{msg.fileName}</p>
                          {msg.text && <p className="text-xs opacity-80">{msg.text}</p>}
                        </div>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t bg-background/50 backdrop-blur-md">
              {/* Sticker Picker */}
              {showStickerPicker && (
                <div className="mb-3 p-3 bg-secondary/50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Stickers</Label>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => setShowStickerPicker(false)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <ScrollArea className="h-32 w-full">
                    <div className="grid grid-cols-8 gap-1">
                      {stickers.map((sticker, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setMessage(prev => prev + sticker);
                            setShowStickerPicker(false);
                          }}
                          className="text-xl hover:bg-secondary/80 rounded p-1 transition-colors text-center"
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              {/* File Attachment Preview */}
              {attachedFile && (
                <div className="mb-3 p-3 bg-secondary/50 rounded-lg border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attachedFile.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <Paperclip className="w-4 h-4" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">{attachedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleRemoveAttachment}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileAttach}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`h-10 w-10 ${showStickerPicker ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="bg-secondary/50"
                />
                <Button 
                  size="icon" 
                  className="h-10 w-10" 
                  style={{ backgroundColor: `rgb(${themeColor})` }}
                  onClick={handleSendMessage}
                  disabled={!message.trim() && !attachedFile}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 hover:bg-secondary/20 cursor-pointer transition-colors"
                  onClick={() => setActiveChat(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                      <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">No chats found</p>
                <p className="text-xs mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Image Editor Modal */}
      {showImageEditor && tempBgImage && (
        <ImageEditor
          imageUrl={tempBgImage}
          onImageEdited={handleImageEdited}
          onClose={() => setShowImageEditor(false)}
        />
      )}

      {/* Fullscreen Chat Dialog */}
      {isFullscreen && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 m-0 rounded-none border-0">
            <div className="flex flex-col h-full bg-background">
              {/* Fullscreen Chat Header */}
              <div className="p-4 border-b flex items-center gap-3 bg-secondary/30 backdrop-blur-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setIsFullscreen(false)}
                  title="Exit fullscreen (Esc)"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activeChat?.avatar || ''} />
                  <AvatarFallback>{activeChat?.name?.[0] || 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {activeChat ? activeChat.name : 'Chats'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeChat ? (activeChat.online ? 'Online' : 'Offline') : 'Fullscreen Mode'}
                  </p>
                </div>
                
                {/* 3-dot theme selector for fullscreen chat */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      title="Chat theme settings"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chat Theme Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-4">
                        <Label>Theme Color (RGB Customizer)</Label>
                        
                        {/* RGB Sliders */}
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-red-600">Red</Label>
                              <span className="text-sm font-mono bg-red-100 px-2 py-1 rounded">{rgbValues.r}</span>
                            </div>
                            <Slider
                              value={[rgbValues.r]}
                              onValueChange={(value) => handleRgbChange('r', value)}
                              max={255}
                              step={1}
                              className="w-full"
                              style={{
                                '--slider-track-background': `linear-gradient(to right, rgb(0, ${rgbValues.g}, ${rgbValues.b}), rgb(255, ${rgbValues.g}, ${rgbValues.b}))`
                              } as React.CSSProperties}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-green-600">Green</Label>
                              <span className="text-sm font-mono bg-green-100 px-2 py-1 rounded">{rgbValues.g}</span>
                            </div>
                            <Slider
                              value={[rgbValues.g]}
                              onValueChange={(value) => handleRgbChange('g', value)}
                              max={255}
                              step={1}
                              className="w-full"
                              style={{
                                '--slider-track-background': `linear-gradient(to right, rgb(${rgbValues.r}, 0, ${rgbValues.b}), rgb(${rgbValues.r}, 255, ${rgbValues.b}))`
                              } as React.CSSProperties}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-blue-600">Blue</Label>
                              <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">{rgbValues.b}</span>
                            </div>
                            <Slider
                              value={[rgbValues.b]}
                              onValueChange={(value) => handleRgbChange('b', value)}
                              max={255}
                              step={1}
                              className="w-full"
                              style={{
                                '--slider-track-background': `linear-gradient(to right, rgb(${rgbValues.r}, ${rgbValues.g}, 0), rgb(${rgbValues.r}, ${rgbValues.g}, 255))`
                              } as React.CSSProperties}
                            />
                          </div>
                        </div>

                        {/* Color Preview and Inputs */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">RGB Value</Label>
                            <Input
                              value={`${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`}
                              onChange={(e) => {
                                const values = e.target.value.split(',').map(v => parseInt(v.trim()));
                                if (values.length === 3 && values.every(v => !isNaN(v) && v >= 0 && v <= 255)) {
                                  setRgbValues({ r: values[0], g: values[1], b: values[2] });
                                }
                              }}
                              placeholder="0, 122, 255"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Hex Color</Label>
                            <div className="flex gap-1">
                              <Input
                                type="color"
                                value={rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b)}
                                onChange={(e) => handleHexInput(e.target.value)}
                                className="w-12 h-9 p-1 rounded"
                              />
                              <Input
                                value={rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b)}
                                onChange={(e) => handleHexInput(e.target.value)}
                                placeholder="#007AFF"
                                className="text-sm flex-1 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Live Preview */}
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <div 
                            className="w-12 h-12 rounded-lg border-2 border-border shadow-inner"
                            style={{ backgroundColor: `rgb(${themeColor})` }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Preview</p>
                            <p className="text-xs text-muted-foreground">RGB({themeColor})</p>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Quick Presets</Label>
                          <div className="grid grid-cols-6 gap-2 mt-2">
                            {[
                              { r: 0, g: 122, b: 255, name: 'Blue' },
                              { r: 255, g: 59, b: 48, name: 'Red' },
                              { r: 52, g: 199, b: 89, name: 'Green' },
                              { r: 255, g: 149, b: 0, name: 'Orange' },
                              { r: 175, g: 82, b: 222, name: 'Purple' },
                              { r: 255, g: 204, b: 0, name: 'Yellow' },
                              { r: 0, g: 0, b: 0, name: 'Black' },
                              { r: 142, g: 142, b: 147, name: 'Gray' },
                              { r: 255, g: 255, b: 255, name: 'White' },
                              { r: 255, g: 45, b: 85, name: 'Pink' },
                              { r: 0, g: 199, b: 190, name: 'Teal' },
                              { r: 88, g: 86, b: 214, name: 'Indigo' }
                            ].map((preset, index) => (
                              <button
                                key={index}
                                onClick={() => setRgbValues({ r: preset.r, g: preset.g, b: preset.b })}
                                className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                                style={{ backgroundColor: `rgb(${preset.r}, ${preset.g}, ${preset.b})` }}
                                title={preset.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Chat Wallpaper</Label>
                        <div className="space-y-2">
                          <Input type="file" accept="image/*" onChange={handleImageUpload} />
                          
                          {/* Wallpaper Preview */}
                          {(tempBgImage || bgImage) && (
                            <div className="relative mt-2 w-full h-32 rounded-lg overflow-hidden border">
                              <img 
                                src={tempBgImage || bgImage} 
                                alt="Wallpaper preview" 
                                className="w-full h-full object-cover" 
                              />
                              <div className="absolute top-1 right-1 flex gap-1">
                                {tempBgImage && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                                    onClick={() => setShowImageEditor(true)}
                                    title="Edit image"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6"
                                  onClick={handleRemoveWallpaper}
                                  title="Remove wallpaper"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        {hasUnsavedChanges && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleDiscardWallpaper}
                              className="flex-1"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Discard
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={handleSaveWallpaper}
                              className="flex-1"
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        )}
                        
                        {/* Additional Theme Controls */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleResetTheme}
                            className="flex-1"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Reset
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRandomTheme}
                            className="flex-1"
                          >
                            <Palette className="w-3 h-3 mr-1" />
                            Random
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">Supports Images & GIFs. Click Edit to crop/resize.</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Fullscreen Chat Content */}
              <div className="flex-1 flex">
                {/* Chat List Sidebar */}
                {!activeChat && (
                  <div className="w-80 border-r">
                    <div className="p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search chats..." 
                          className="pl-8 bg-background/50" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="divide-y divide-border/20">
                        {filteredContacts.length > 0 ? (
                          filteredContacts.map((contact) => (
                            <div
                              key={contact.id}
                              className="flex items-center gap-3 p-3 hover:bg-secondary/20 cursor-pointer transition-colors"
                              onClick={() => setActiveChat(contact)}
                            >
                              <div className="relative">
                                <Avatar>
                                  <AvatarImage src={contact.avatar} />
                                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                                </Avatar>
                                {contact.online && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className="font-medium text-sm truncate">{contact.name}</p>
                                  <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-medium">No chats found</p>
                            <p className="text-xs mt-1">Try adjusting your search</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Active Chat Area */}
                {activeChat ? (
                  <div className="flex-1 flex flex-col bg-muted/10 relative">
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: (tempBgImage || bgImage) ? undefined : `rgba(${themeColor}, 0.05)`,
                        backgroundImage: (tempBgImage || bgImage) ? `url(${tempBgImage || bgImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: (tempBgImage || bgImage) ? 1 : 0.1
                      }}
                    />
                    
                    {/* Messages Area */}
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                      {messages[activeChat.id]?.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${msg.sender === 'user' ? 'text-white' : 'bg-secondary'} p-4 rounded-2xl ${msg.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} text-sm`}>
                            {msg.type === 'image' && msg.fileUrl ? (
                              <div className="space-y-2">
                                <img src={msg.fileUrl} alt="Shared image" className="max-w-full rounded-lg" />
                                {msg.text && <p>{msg.text}</p>}
                              </div>
                            ) : msg.type === 'file' && msg.fileUrl ? (
                              <div className="flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />
                                <div>
                                  <p className="font-medium">{msg.fileName}</p>
                                  {msg.text && <p className="text-xs opacity-80">{msg.text}</p>}
                                </div>
                              </div>
                            ) : (
                              <p>{msg.text}</p>
                            )}
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center text-muted-foreground py-16">
                          <p className="text-sm">No messages yet. Start the conversation!</p>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-background/50 backdrop-blur-md">
                      {/* File Attachment Preview */}
                      {attachedFile && (
                        <div className="mb-3 p-3 bg-secondary/50 rounded-lg border flex items-center justify-between max-w-4xl mx-auto">
                          <div className="flex items-center gap-2">
                            {attachedFile.type.startsWith('image/') ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : (
                              <Paperclip className="w-4 h-4" />
                            )}
                            <span className="text-sm truncate max-w-[300px]">{attachedFile.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleRemoveAttachment}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex gap-3 max-w-4xl mx-auto">
                        <div className="relative">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={handleFileAttach}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                            <Paperclip className="w-5 h-5" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`h-10 w-10 ${showStickerPicker ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                          onClick={() => setShowStickerPicker(!showStickerPicker)}
                        >
                          <Smile className="w-5 h-5" />
                        </Button>
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="bg-secondary/50 flex-1"
                        />
                        <Button 
                          size="icon" 
                          className="h-10 w-10" 
                          style={{ backgroundColor: `rgb(${themeColor})` }}
                          onClick={handleSendMessage}
                          disabled={!message.trim() && !attachedFile}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Select a chat to start messaging</p>
                      <p className="text-sm mt-2">Choose from your conversations on the left</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatSidebar;
