-- Function to update church member count
CREATE OR REPLACE FUNCTION update_church_member_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the member_count for the affected church(es)
  IF TG_OP = 'DELETE' THEN
    UPDATE churches
    SET member_count = (
      SELECT COUNT(*)
      FROM church_members
      WHERE church_id = OLD.church_id
        AND is_active = true
    )
    WHERE id = OLD.church_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update both old and new church if church_id changed
    IF OLD.church_id != NEW.church_id THEN
      UPDATE churches
      SET member_count = (
        SELECT COUNT(*)
        FROM church_members
        WHERE church_id = OLD.church_id
          AND is_active = true
      )
      WHERE id = OLD.church_id;
    END IF;
    
    UPDATE churches
    SET member_count = (
      SELECT COUNT(*)
      FROM church_members
      WHERE church_id = NEW.church_id
        AND is_active = true
    )
    WHERE id = NEW.church_id;
    RETURN NEW;
  ELSE -- INSERT
    UPDATE churches
    SET member_count = (
      SELECT COUNT(*)
      FROM church_members
      WHERE church_id = NEW.church_id
        AND is_active = true
    )
    WHERE id = NEW.church_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for insert, update, delete on church_members
DROP TRIGGER IF EXISTS trigger_update_church_member_count ON church_members;
CREATE TRIGGER trigger_update_church_member_count
AFTER INSERT OR UPDATE OR DELETE ON church_members
FOR EACH ROW
EXECUTE FUNCTION update_church_member_count();

-- Recalculate member counts for all existing churches
UPDATE churches c
SET member_count = (
  SELECT COUNT(*)
  FROM church_members cm
  WHERE cm.church_id = c.id
    AND cm.is_active = true
);