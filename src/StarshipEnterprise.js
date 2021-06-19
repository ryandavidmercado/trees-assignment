const Queue = require("./Queue");

class StarshipEnterprise {
  constructor(officerId = null, officerName = null, reportTo = null) {
    this.officerId = officerId;
    this.officerName = officerName;
    this.reportTo = reportTo; // the officer that the new officer reports to
    this.leftReport = null;
    this.rightReport = null;
  }

  assignOfficer(officerId, officerName) {
    if (!this.officerId) {
      this.officerId = officerId;
      this.officerName = officerName;
      return;
    }

    const assignmentSide =
      officerId < this.officerId ? "leftReport" : "rightReport";

    if (!this[assignmentSide]) {
      this[assignmentSide] = new StarshipEnterprise(
        officerId,
        officerName,
        this
      );
    } else {
      this[assignmentSide].assignOfficer(officerId, officerName);
    }
  }

  findOfficersWithNoDirectReports() {
    if (!this.leftReport && !this.rightReport) return [this.officerName];

    const validDescendantsLeft =
      this.leftReport?.findOfficersWithNoDirectReports() || [];
    const validDescendantsRight =
      this.rightReport?.findOfficersWithNoDirectReports() || [];

    return [...validDescendantsLeft, ...validDescendantsRight];
  }

  listOfficersByExperience() {
    if (!this.leftReport && !this.rightReport) return [this.officerName];

    const leftOfficers = this.leftReport?.listOfficersByExperience() || [];
    const rightOfficers = this.rightReport?.listOfficersByExperience() || [];

    return [...rightOfficers, this.officerName, ...leftOfficers];
  }

  listOfficersByRank(root) {
    const queue = new Queue();
    queue.enqueue({
      rank: 1,
      officer: root,
    });
    const officerRanks = {};

    while (1 < 2) {
      const { rank, officer } = queue.dequeue() || {};
      if (!officer) break;

      if (officerRanks[rank]) officerRanks[rank].push(officer.officerName);
      else officerRanks[rank] = [officer.officerName];

      if (officer.leftReport) {
        queue.enqueue({ rank: rank + 1, officer: officer.leftReport });
      }
      if (officer.rightReport) {
        queue.enqueue({ rank: rank + 1, officer: officer.rightReport });
      }
    }

    return officerRanks;
  }
}

module.exports = StarshipEnterprise;
