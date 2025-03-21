"use client";
import { RoleGate } from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
// import { useCurrentRole } from "@/hooks/use-current-role";

const AdminPage = () => {
  //   const role = useCurrentRole();
  return (
    <Card className="w-[600px]">
      <CardHeader className="text-2xl font-semibold text-center">
        🔑 Admin
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="you are allowed to see this page" />
        </RoleGate>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
