-- Replace 'carnival' with 'pet' in theme enums
-- Step 1: Add 'pet' to the enum columns
ALTER TABLE `ratings` MODIFY COLUMN `theme` enum('animals','monster','art','gender','epic','gangster','circus','carnival','pet') NOT NULL;
ALTER TABLE `transformation_history` MODIFY COLUMN `theme` enum('animals','monster','art','gender','epic','gangster','circus','carnival','pet') NOT NULL;

-- Step 2: Update existing data from carnival to pet
UPDATE `ratings` SET `theme` = 'pet' WHERE `theme` = 'carnival';
UPDATE `transformation_history` SET `theme` = 'pet' WHERE `theme` = 'carnival';

-- Step 3: Remove 'carnival' from the enum
ALTER TABLE `ratings` MODIFY COLUMN `theme` enum('animals','monster','art','gender','epic','gangster','circus','pet') NOT NULL;
ALTER TABLE `transformation_history` MODIFY COLUMN `theme` enum('animals','monster','art','gender','epic','gangster','circus','pet') NOT NULL;
