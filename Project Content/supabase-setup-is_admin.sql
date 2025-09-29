-- Returns true if the user is an admin (exists in admin_users)
create or replace function is_admin(p_user_id uuid)
returns boolean as $$
begin
  return exists(select 1 from admin_users where user_id = p_user_id);
end;
$$ language plpgsql stable;
