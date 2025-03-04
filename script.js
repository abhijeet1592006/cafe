import 'peerjs';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const goToConnectBtn = document.getElementById('go-to-connect-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const homePage = document.getElementById('home-page');
    const connectionPage = document.getElementById('connection-page');
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const roomCodeInput = document.getElementById('room-code-input');
    const initialView = document.getElementById('initial-view');
    const roomView = document.getElementById('room-view');
    const roomCodeDisplay = document.getElementById('room-code');
    const connectionStatus = document.getElementById('connection-status');
    const chatArea = document.getElementById('chat-area');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const videoContainer = document.getElementById('video-container');
    const localVideo = document.getElementById('local-video');
    const remoteVideo = document.getElementById('remote-video');
    const toggleVideoBtn = document.getElementById('toggle-video-btn');
    const toggleAudioBtn = document.getElementById('toggle-audio-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const menuBtn = document.getElementById('menu-btn');
    const menuModal = document.getElementById('menu-modal');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuItems = document.querySelectorAll('.menu-item');
    const coinDisplay = document.getElementById('coin-display');
    const tableItemsContainer = document.getElementById('table-items');
    
    // State variables
    let peer = null;
    let connection = null;
    let myRoomCode = '';
    let localStream = null;
    let remoteStream = null;
    let call = null;
    let isVideoEnabled = true;
    let isAudioEnabled = true;
    let isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    let coins = 1000;
    let orderedItems = [];
    let sharedItems = [];
    
    // Initialize theme
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>';
    } else {
        themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg>';
    }
    
    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
        
        if (isDarkTheme) {
            themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path></svg>';
        } else {
            themeToggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg>';
        }
    });
    
    // Navigation functions
    goToConnectBtn.addEventListener('click', () => {
        homePage.classList.add('hidden');
        connectionPage.classList.remove('hidden');
    });
    
    backToHomeBtn.addEventListener('click', () => {
        connectionPage.classList.add('hidden');
        homePage.classList.remove('hidden');
    });
    
    // Initialize video stream
    async function initializeLocalStream() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            localVideo.srcObject = localStream;
            return true;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            localVideo.classList.add('no-video');
            localVideo.innerHTML = `
                <div class="no-video-message">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.5 7H3.5C2.5 7 2 7.5 2 8.5V15.5C2 16.5 2.5 17 3.5 17H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M15.5000 17H18.5000C19.5000 17 20.0000 16.5 20.0000 15.5V8.5C20.0000 7.5 19.5000 7 18.5000 7H15.5000" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        <rect x="6.5" y="5" width="9" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                        <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <p>Camera unavailable</p>
                </div>
            `;
            return false;
        }
    }
    
    // Toggle video stream
    toggleVideoBtn.addEventListener('click', () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                isVideoEnabled = !isVideoEnabled;
                videoTracks[0].enabled = isVideoEnabled;
                toggleVideoBtn.innerHTML = isVideoEnabled ? 
                    '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/></svg> Turn Off' : 
                    '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9.64 7.64c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg> Turn On';
            }
        }
    });
    
    // Toggle audio stream
    toggleAudioBtn.addEventListener('click', () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                isAudioEnabled = !isAudioEnabled;
                audioTracks[0].enabled = isAudioEnabled;
                toggleAudioBtn.innerHTML = isAudioEnabled ? 
                    '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg> Mute' : 
                    '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/></svg> Unmute';
            }
        }
    });

    // Generate a random 3-digit code
    function generateRoomCode() {
        return Math.floor(100 + Math.random() * 900).toString();
    }
    
    // Update connection status UI
    function updateStatus(message, isError = false) {
        connectionStatus.textContent = message;
        connectionStatus.style.backgroundColor = isError ? '#ffcccc' : '#d1ffcc';
        connectionStatus.style.color = isError ? '#990000' : '#006600';
    }
    
    // Display current coin amount
    function updateCoinDisplay() {
        coinDisplay.textContent = `${coins} coins`;
    }
    
    // Add a food item to the table
    function addItemToTable(itemName, isShared = false, itemId = null) {
        const uniqueId = itemId || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const itemElement = document.createElement('div');
        itemElement.classList.add('food-item');
        itemElement.dataset.itemId = uniqueId;
        
        let itemHTML = '';
        switch(itemName) {
            case 'Croissant':
                itemHTML = `<div class="croissant"></div>`;
                break;
            case 'Cake':
                itemHTML = `<div class="cake"><div class="cake-layer"></div><div class="cake-layer"></div><div class="cake-top"></div></div>`;
                break;
            case 'Cookie':
                itemHTML = `<div class="cookie"><div class="cookie-chip"></div><div class="cookie-chip"></div><div class="cookie-chip"></div><div class="cookie-chip"></div></div>`;
                break;
            case 'Sandwich':
                itemHTML = `<div class="sandwich"><div class="sandwich-layer"></div><div class="sandwich-filling"></div><div class="sandwich-layer"></div></div>`;
                break;
            case 'Donut':
                itemHTML = `<div class="donut"><div class="donut-hole"></div><div class="donut-icing"></div></div>`;
                break;
        }
        
        itemElement.innerHTML = itemHTML;
        
        if (isShared) {
            itemElement.classList.add('shared-item');
            addMessage(`Friend shared a ${itemName} with you!`, false);
        } else {
            if (!orderedItems.includes(itemName)) {
                orderedItems.push(itemName);
            }
        }
        
        // Find an empty slot to place the food item
        const slots = document.querySelectorAll('.food-slot');
        let emptySlot = null;
        
        for (const slot of slots) {
            if (slot.children.length === 0) {
                emptySlot = slot;
                break;
            }
        }
        
        // If no empty slot, put it in a random position
        if (!emptySlot) {
            tableItemsContainer.appendChild(itemElement);
            // Position randomly within the table
            const randomX = Math.random() * 60 - 30;
            const randomY = Math.random() * 60 - 30;
            itemElement.style.position = 'absolute';
            itemElement.style.left = `calc(50% + ${randomX}px)`;
            itemElement.style.top = `calc(50% + ${randomY}px)`;
        } else {
            emptySlot.appendChild(itemElement);
        }
        
        // Animate the item appearing
        setTimeout(() => {
            itemElement.style.opacity = '1';
            itemElement.style.transform = 'translateY(0) rotate(0)';
            
            // Add gentle bounce animation
            itemElement.style.animation = 'gentle-bounce 2s ease-in-out infinite';
        }, 100);
        
        // Make items clickable for additional interactions
        itemElement.addEventListener('click', () => {
            // Animation for "eating" the food
            itemElement.style.animation = 'none';
            itemElement.style.transition = 'all 0.5s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'scale(0.5)';
            
            // Notify peer about item being eaten
            if (connection && connection.open) {
                connection.send(JSON.stringify({
                    type: 'eat',
                    itemId: uniqueId
                }));
            }
            
            setTimeout(() => {
                itemElement.remove();
                // Remove from ordered items if it was ordered by this user
                if (orderedItems.includes(itemName)) {
                    const index = orderedItems.indexOf(itemName);
                    if (index > -1) {
                        orderedItems.splice(index, 1);
                    }
                }
                addMessage(`You enjoyed the ${itemName}!`, true);
            }, 500);
        });
    }
    
    // Order a menu item
    function orderMenuItem(itemName, price) {
        if (coins >= price) {
            coins -= price;
            updateCoinDisplay();
            const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            addItemToTable(itemName, false, itemId);
            addMessage(`You ordered a ${itemName} for ${price} coins`, true);
            
            // Send order to peer
            if (connection && connection.open) {
                connection.send(JSON.stringify({
                    type: 'order',
                    item: itemName,
                    price: price,
                    showItem: true,
                    itemId: itemId  // Add a unique ID to sync the item
                }));
            }
        } else {
            alert("Not enough coins!");
        }
    }
    
    // Share an item with peer
    function shareItem(itemName) {
        if (orderedItems.includes(itemName)) {
            if (connection && connection.open) {
                const itemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                connection.send(JSON.stringify({
                    type: 'share',
                    item: itemName,
                    itemId: itemId
                }));
                addMessage(`You shared a ${itemName} with your friend!`, true);
                
                // Remove from ordered items
                const index = orderedItems.indexOf(itemName);
                if (index > -1) {
                    orderedItems.splice(index, 1);
                }
            }
        }
    }
    
    // Initialize menu
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemName = item.getAttribute('data-item');
            const itemPrice = parseInt(item.getAttribute('data-price'));
            orderMenuItem(itemName, itemPrice);
        });
    });
    
    // Initialize menu book
    menuBtn.addEventListener('click', () => {
        document.getElementById('menu-book').classList.add('open');
    });
    
    closeMenuBtn.addEventListener('click', () => {
        document.getElementById('menu-book').classList.remove('open');
    });
    
    // Add a message to the chat
    function addMessage(message, isSent = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isSent ? 'sent' : 'received');
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Create a new room
    createRoomBtn.addEventListener('click', async () => {
        // Generate a 3-digit code
        myRoomCode = generateRoomCode();
        
        // Initialize coins
        coins = 1000;
        updateCoinDisplay();
        
        // Initialize video first
        await initializeLocalStream();
        
        // Initialize PeerJS
        peer = new Peer(myRoomCode);
        
        // Handle successful connection
        peer.on('open', (id) => {
            initialView.classList.add('hidden');
            roomView.classList.remove('hidden');
            roomCodeDisplay.textContent = myRoomCode;
            updateStatus('Waiting for someone to join...', false);
            videoContainer.classList.remove('hidden');
            
            // Listen for incoming connections
            peer.on('connection', (conn) => {
                connection = conn;
                
                connection.on('open', () => {
                    updateStatus('Connected!', false);
                    chatArea.classList.remove('hidden');
                    
                    // Handle incoming data
                    connection.on('data', (data) => {
                        try {
                            const jsonData = JSON.parse(data);
                            if (jsonData.type === 'order') {
                                addMessage(`Friend ordered a ${jsonData.item} for ${jsonData.price} coins`, false);
                                // Display the item on the table for both peers
                                if (jsonData.showItem) {
                                    addItemToTable(jsonData.item, false, jsonData.itemId);
                                }
                            } else if (jsonData.type === 'share') {
                                addItemToTable(jsonData.item, true, jsonData.itemId);
                                sharedItems.push(jsonData.item);
                            } else if (jsonData.type === 'eat') {
                                // Find and remove the eaten item by its ID
                                const itemToRemove = document.querySelector(`.food-item[data-item-id="${jsonData.itemId}"]`);
                                if (itemToRemove) {
                                    itemToRemove.style.animation = 'none';
                                    itemToRemove.style.transition = 'all 0.5s ease';
                                    itemToRemove.style.opacity = '0';
                                    itemToRemove.style.transform = 'scale(0.5)';
                                    
                                    setTimeout(() => {
                                        itemToRemove.remove();
                                        addMessage(`Friend enjoyed their food!`, false);
                                    }, 500);
                                }
                            } else {
                                addMessage(data, false);
                            }
                        } catch (e) {
                            // If not JSON, treat as regular message
                            addMessage(data, false);
                        }
                    });
                    
                    connection.on('close', () => {
                        updateStatus('Connection closed', true);
                        chatArea.classList.add('hidden');
                    });
                    
                    connection.on('error', (err) => {
                        updateStatus('Connection error: ' + err, true);
                    });
                });
                
                connection.on('close', () => {
                    updateStatus('Connection closed', true);
                    chatArea.classList.add('hidden');
                });
                
                connection.on('error', (err) => {
                    updateStatus('Connection error: ' + err, true);
                });
            });
            
            // Handle incoming calls
            peer.on('call', (incomingCall) => {
                call = incomingCall;
                call.answer(localStream);
                
                call.on('stream', (stream) => {
                    remoteStream = stream;
                    remoteVideo.srcObject = stream;
                });
                
                call.on('error', (err) => {
                    console.error('Call error:', err);
                    remoteVideo.classList.add('no-video');
                    remoteVideo.innerHTML = `
                        <div class="no-video-message">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.5 7H3.5C2.5 7 2 7.5 2 8.5V15.5C2 16.5 2.5 17 3.5 17H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M15.5000 17H18.5000C19.5000 17 20.0000 16.5 20.0000 15.5V8.5C20.0000 7.5 19.5000 7 18.5000 7H15.5000" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <rect x="6.5" y="5" width="9" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                                <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <p>Friend's video unavailable</p>
                        </div>
                    `;
                });
            });
        });
        
        // Handle error
        peer.on('error', (err) => {
            updateStatus('Error creating room: ' + err, true);
        });
    });
    
    // Join an existing room
    joinRoomBtn.addEventListener('click', async () => {
        const targetRoomCode = roomCodeInput.value.trim();
        
        if (targetRoomCode.length !== 3 || isNaN(targetRoomCode)) {
            updateStatus('Please enter a valid 3-digit code', true);
            return;
        }
        
        // Initialize coins
        coins = 1000;
        updateCoinDisplay();
        
        // Initialize video first
        await initializeLocalStream();
        
        // Initialize PeerJS with a random ID
        peer = new Peer();
        
        peer.on('open', (id) => {
            // Connect to the target peer
            connection = peer.connect(targetRoomCode);
            
            initialView.classList.add('hidden');
            roomView.classList.remove('hidden');
            roomCodeDisplay.textContent = targetRoomCode;
            updateStatus('Connecting...', false);
            videoContainer.classList.remove('hidden');
            
            connection.on('open', () => {
                updateStatus('Connected!', false);
                chatArea.classList.remove('hidden');
                
                // Make a call
                if (localStream) {
                    call = peer.call(targetRoomCode, localStream);
                    
                    call.on('stream', (stream) => {
                        remoteStream = stream;
                        remoteVideo.srcObject = stream;
                    });
                    
                    call.on('error', (err) => {
                        console.error('Call error:', err);
                        remoteVideo.classList.add('no-video');
                        remoteVideo.innerHTML = `
                            <div class="no-video-message">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.5 7H3.5C2.5 7 2 7.5 2 8.5V15.5C2 16.5 2.5 17 3.5 17H6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    <path d="M15.5000 17H18.5000C19.5000 17 20.0000 16.5 20.0000 15.5V8.5C20.0000 7.5 19.5000 7 18.5000 7H15.5000" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                    <rect x="6.5" y="5" width="9" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                                    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                                <p>Friend's video unavailable</p>
                            </div>
                        `;
                    });
                }
                
                // Handle incoming data
                connection.on('data', (data) => {
                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.type === 'order') {
                            addMessage(`Friend ordered a ${jsonData.item} for ${jsonData.price} coins`, false);
                            // Display the item on the table for both peers
                            if (jsonData.showItem) {
                                addItemToTable(jsonData.item, false, jsonData.itemId);
                            }
                        } else if (jsonData.type === 'share') {
                            addItemToTable(jsonData.item, true, jsonData.itemId);
                            sharedItems.push(jsonData.item);
                        } else if (jsonData.type === 'eat') {
                            // Find and remove the eaten item by its ID
                            const itemToRemove = document.querySelector(`.food-item[data-item-id="${jsonData.itemId}"]`);
                            if (itemToRemove) {
                                itemToRemove.style.animation = 'none';
                                itemToRemove.style.transition = 'all 0.5s ease';
                                itemToRemove.style.opacity = '0';
                                itemToRemove.style.transform = 'scale(0.5)';
                                
                                setTimeout(() => {
                                    itemToRemove.remove();
                                    addMessage(`Friend enjoyed their food!`, false);
                                }, 500);
                            }
                        } else {
                            addMessage(data, false);
                        }
                    } catch (e) {
                        // If not JSON, treat as regular message
                        addMessage(data, false);
                    }
                });
            });
            
            connection.on('close', () => {
                updateStatus('Connection closed', true);
                chatArea.classList.add('hidden');
            });
            
            connection.on('error', (err) => {
                updateStatus('Connection error: ' + err, true);
            });
        });
        
        peer.on('error', (err) => {
            updateStatus('Error joining room: ' + err, true);
        });
    });
    
    // Send messages
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && connection && connection.open) {
            // Check if message is a command to share food
            if (message.startsWith('/share ')) {
                const itemToShare = message.substring(7);
                if (orderedItems.includes(itemToShare)) {
                    shareItem(itemToShare);
                } else {
                    addMessage(`You don't have a ${itemToShare} to share`, true);
                }
            } else {
                connection.send(message);
                addMessage(message, true);
            }
            messageInput.value = '';
        }
    }
});