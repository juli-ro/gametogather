using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gtg_backend.Migrations
{
    /// <inheritdoc />
    public partial class UserNameUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsParticipating",
                table: "MeetUsers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Name",
                table: "Users",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Name",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsParticipating",
                table: "MeetUsers");
        }
    }
}
