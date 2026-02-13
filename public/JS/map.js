// Get listing ID from URL
const listingId = window.location.pathname.split("/")[2];


// Fetch geometry data from API
fetch(`/listings/api/${listingId}`)
    .then(res => res.json())
    .then(data => {

        const coords = data.geometry.coordinates;

        // GeoJSON = [lng, lat]
        const lat = coords[1];
        const lng = coords[0];

        // Create map
        const map = L.map("map").setView([lat, lng], 12);

        // Add OpenStreetMap tiles
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        // Custom Wanderlust icon
        const wanderlustIcon = L.divIcon({
           html: '<i class="fa-regular fa-compass" style="color:#fe424d; font-size:30px;"></i>',
           className: "custom-marker",
           iconSize: [30, 30],
           iconAnchor: [15, 30],
           popupAnchor: [0, -30]
        });

        // Add marker
        const marker = L.marker([lat, lng], { icon: wanderlustIcon })
           .addTo(map);

           // Popup content 
           const popupContent = `
           <div style="padding:5px;">
           <strong>${data.title}</strong><br />
           <span style="color:gray; font-size:13px;">
               Exact location provided after booking
            </span>
            </div>
            `;
            marker.bindPopup(popupContent);
    })
    .catch(err => console.error("Map error:", err));
