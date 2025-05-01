import { Component, OnInit } from '@angular/core';
import { ClubMembershipService } from '../../../../services/club-membership.service';
import { ClubMembershipDTO } from '../color/models/ClubMembershipDTO.model';
import { CommonModule } from '@angular/common';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { NgModel, FormsModule } from '@angular/forms';
import { LoginService } from '../../../../login.service';
import { role } from '../color/models/ClubMembershipDTO.model';

@Component({
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule, FormsModule],
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  members: ClubMembershipDTO[] = [];
  loading: boolean = true;
  error: string | null = null;
  activeDropdownMemberId: number | null = null;
  selectedRole: role = role.MEMBRE;
  availableRoles = Object.values(role);

  constructor(
    private membershipService: ClubMembershipService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading = true;
    this.error = null;

    const username = localStorage.getItem('username');
    if (!username) {
      this.error = 'Username non disponible dans le localStorage';
      this.loading = false;
      return;
    }

    this.membershipService.getMembersByClub(username).subscribe({
      next: (members) => {
        this.members = members;
        this.loading = false;
      },
      error: (err) => {
        console.error('[ColorComponent] Error loading members:', err);
        this.error = 'Erreur lors du chargement des membres';
        this.loading = false;
      }
    });
  }

  toggleDropdown(member: ClubMembershipDTO): void {
    if (this.activeDropdownMemberId === member.id) {
      this.closeDropdown();
    } else {
      this.activeDropdownMemberId = member.id;
      this.selectedRole = member.role;
    }
  }

  closeDropdown(): void {
    this.activeDropdownMemberId = null;
  }

  confirmRoleChange(member: ClubMembershipDTO): void {
    if (!member.id) {
      console.error('Membership ID is missing for member:', member);
      return;
    }
    console.log('Selected role:', this.selectedRole);
    console.log('Member ID:', member.id);
    if (!Object.values(role).includes(this.selectedRole)) {
      alert('Rôle invalide.');
      return;
    }

    this.membershipService.updateMemberRole(member.id, this.selectedRole).subscribe({
      next: () => {
        member.role = this.selectedRole;
        this.closeDropdown();
      },
      error: (err) => {
        console.error('Error updating role:', err);
        alert('Erreur lors de la modification du rôle.');
      }
    });
  }

  removeMember(member: ClubMembershipDTO): void {
    if (!member.id) {
      console.error('Membership ID is missing for member:', member);
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir retirer ${member.nom} ${member.prenom} du club ?`)) {
      this.membershipService.removeMemberFromClub(member.id).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.id !== member.id);
        },
        error: (err) => {
          console.error('Error removing member:', err);
          alert('Erreur lors du retrait du membre.');
        }
      });
    }
  }
}
