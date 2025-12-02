-- Update church_locations structure to support lat/lng coordinates
-- This allows us to display all locations on a single map with multiple pins

-- Note: We're keeping the existing church_locations JSONB column structure
-- and just updating how we use it. Each location object should have:
-- { name: string, address: string, latitude: number, longitude: number }

-- No schema changes needed since church_locations is already JSONB,
-- but this migration serves as documentation for the new structure

COMMENT ON COLUMN contact_page_settings.church_locations IS 
'JSONB array of church locations with structure: 
[{ "name": "Church Name", "address": "Full Address", "latitude": 0.0, "longitude": 0.0 }]
Latitude and longitude are used to display all locations on a single interactive map.';