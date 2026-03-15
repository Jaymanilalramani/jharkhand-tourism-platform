-- Top destinations by visitors
SELECT 
    d.name AS destination,
    d.type,
    d.district,
    COUNT(b._id) AS total_bookings,
    SUM(b.amount) AS total_revenue,
    AVG(f.rating) AS average_rating
FROM destinations d
LEFT JOIN bookings b ON d._id = b.destinationId
LEFT JOIN feedback f ON d._id = f.destinationId
GROUP BY d._id, d.name, d.type, d.district
ORDER BY total_bookings DESC, total_revenue DESC;

-- Monthly revenue report
SELECT 
    DATE_FORMAT(b.checkIn, '%Y-%m') AS month,
    COUNT(b._id) AS total_bookings,
    SUM(b.amount) AS total_revenue,
    AVG(DATEDIFF(b.checkOut, b.checkIn)) AS avg_stay_duration
FROM bookings b
WHERE b.status = 'completed'
GROUP BY DATE_FORMAT(b.checkIn, '%Y-%m')
ORDER BY month DESC;

-- User preferences analysis
SELECT 
    preferences->>'$.budget' AS budget_category,
    preferences->>'$.pace' AS travel_pace,
    COUNT(_id) AS user_count,
    AVG(
        (SELECT COUNT(*) FROM JSON_TABLE(preferences->>'$.interests', '$[*]' COLUMNS(interest VARCHAR(50) PATH '$')) AS interests)
    ) AS avg_interests_count
FROM users
GROUP BY preferences->>'$.budget', preferences->>'$.pace'
ORDER BY user_count DESC;

-- Destination rating distribution
SELECT 
    d.name AS destination,
    COUNT(f._id) AS total_reviews,
    SUM(CASE WHEN f.rating >= 4 THEN 1 ELSE 0 END) AS positive_reviews,
    SUM(CASE WHEN f.rating <= 2 THEN 1 ELSE 0 END) AS negative_reviews,
    ROUND(AVG(f.rating), 2) AS average_rating
FROM destinations d
LEFT JOIN feedback f ON d._id = f.destinationId
GROUP BY d._id, d.name
HAVING total_reviews > 0
ORDER BY average_rating DESC;