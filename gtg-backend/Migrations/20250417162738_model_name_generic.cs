using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gtg_backend.Migrations
{
    /// <inheritdoc />
    public partial class model_name_generic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Users",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "RoleName",
                table: "Roles",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Movies",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ImageTitle",
                table: "Images",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "GroupName",
                table: "Groups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "GameTitle",
                table: "Games",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "GenreName",
                table: "GameGenres",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "AssignmentTitle",
                table: "Assignments",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ActivityName",
                table: "Activities",
                newName: "Name");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Meets",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Meets");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Users",
                newName: "UserName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Roles",
                newName: "RoleName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Movies",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Images",
                newName: "ImageTitle");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Groups",
                newName: "GroupName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Games",
                newName: "GameTitle");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "GameGenres",
                newName: "GenreName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Assignments",
                newName: "AssignmentTitle");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Activities",
                newName: "ActivityName");
        }
    }
}
