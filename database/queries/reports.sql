-- Monthly performance report
SELECT 
    YEAR(b.checkIn) AS year,
    MONTH(b.checkIn) AS month,
    COUNT(DISTINCT b.userId) AS unique_visitors,
    COUNT(b._id) AS total_bookings,
    SUM(b.amount) AS total_revenue,
    ROUND(SUM(b.amount) / COUNT(b._id), 2) AS avg_booking_value
FROM bookings b
WHERE b.status = 'completed'
GROUP BY YEAR(b.checkIn), MONTH(b.checkIn)
ORDER BY year DESC, month DESC;

-- Destination popularity by season
SELECT 
    d.name AS destination,
    d.type,
    d.district,
    QUARTER(b.checkIn) AS quarter,
    COUNT(b._id) AS bookings_count,
    SUM(b.amount) AS quarter_revenue
FROM destinations d
JOIN bookings b ON d._id = b.destinationId
WHERE b.status = 'completed'
GROUP BY d._id, d.name, d.type, d.district, QUARTER(b.checkIn)
ORDER BY quarter, bookings_count DESC;

-- User engagement metrics
SELECT 
    u.name AS user_name,
    u.email,
    COUNT(DISTINCT b.destinationId) AS destinations_visited,
    COUNT(b._id) AS total_trips,
    SUM(b.amount) AS total_spent,
    MAX(b.checkIn) AS last_visit
FROM users u
LEFT JOIN bookings b ON u._id = b.userId
WHERE b.status = 'completed'
GROUP BY u._id, u.name, u.email
ORDER BY total_spent DESC;

-- Revenue by destination type
SELECT 
    d.type AS destination_type,
    COUNT(b._id) AS total_bookings,
    SUM(b.amount) AS total_revenue,
    ROUND(AVG(b.amount), 2) AS avg_booking_value,
    ROUND(SUM(b.amount) / COUNT(DISTINCT b.userId), 2) AS revenue_per_user
FROM destinations d
JOIN bookings b ON d._id = b.destinationId
WHERE b.status = 'completed'
GROUP BY d.type
ORDER BY total_revenue DESC;