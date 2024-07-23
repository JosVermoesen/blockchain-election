// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Nader Dabit's Solidity Path
// https://www.youtube.com/watch?v=GB3hiiNNDjk

/**
 * @title Election
 * @dev Implements voting process along with vote delegation
 */
contract Election {
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted; // if true, that person already voted
        address delegate; // person delegated to
        uint vote; // index of the voted Candidate
    }

    struct Candidate {
        // If you can limit the length to a certain number of bytes,
        // always use one of bytes1 to bytes32 because they are much cheaper
        uint id;
        bytes32 name; // short name (up to 32 bytes)
        bytes32 imageUrl; // url to the image of candidate (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }
    address public chairperson;

    bool public initialized = false;

    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    event CandidatesInitiated();
    event GiveRightToVote();
    event CandidateVoted();    

    constructor() {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
    }

    function initCandidates(
        bytes32[] memory candidateNames,
        bytes32[] memory candidateImages
    ) public {
        require(msg.sender == chairperson, "Only chairperson can initialize");
        require(!initialized, "Already initialized");
        initialized = true;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(
                Candidate({
                    id: i + 1,
                    name: candidateNames[i],
                    imageUrl: candidateImages[i],
                    voteCount: 0
                })
            );
        }
        emit CandidatesInitiated();
    }

    /**
     * @dev Give 'voter' the right to vote on this election. May only be called by 'chairperson'.
     * @param voter address of voter
     */
    function giveRightToVote(address voter) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;

        emit GiveRightToVote();
    }

    /**
     * @dev Calls allowedToVote() function to check if ready to citizen allowed to vote
     * @return canVote_ true or error
     */
    function allowedToVote(
        address _citizen
    ) public view returns (bool canVote_) {
        canVote_ = false;
        if (voters[_citizen].weight != 0) {
            canVote_ = true;
        }
        return canVote_;
    }

    /**
     * @dev Delegate your vote to the voter 'to'.
     * @param to address to which vote is delegated
     */
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // We found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            candidates[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }
    }

    /**
     * @dev Give your vote (including votes delegated to you) to Candidate 'candidates[Candidate].name'.
     * @param _candidate index of Candidate in the candidates array
     */
    function vote(uint _candidate) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = _candidate;

        // If 'Candidate' is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        candidates[_candidate].voteCount += sender.weight;
        emit CandidateVoted();
    }

    /**
     * @dev Give your number of vote to Candidate
     * @param _candidate index of Candidate in the candidates array
     */
    function candidateVotes(uint _candidate) public view returns (uint) {
        if (_candidate >= candidates.length) {
            revert("Candidate index out of bounds");
        }
        return candidates[_candidate].voteCount;
    }

    /**
     * @dev Computes the winning Candidate taking all previous votes into account.
     * @return winningCandidate_ index of winning Candidate in the candidates array
     */
    function winningCandidate() public view returns (uint winningCandidate_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < candidates.length; p++) {
            if (candidates[p].voteCount > winningVoteCount) {
                winningVoteCount = candidates[p].voteCount;
                winningCandidate_ = p;
            }
        }
    }

    /**
     * @dev Calls winningCandidate() function to get the index of the winner contained in the candidates array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = candidates[winningCandidate()].name;
    }

    /**
     * @dev Calls winningCandidate() function to get the index of the winner contained in the candidates array and then
     * @return winnerImage_ the name of the winner
     */
    function winnerImage() public view returns (bytes32 winnerImage_) {
        winnerImage_ = candidates[winningCandidate()].imageUrl;
    }

    function candidatesCount() public view returns (uint) {
        return candidates.length;
    }

    function getCandidate(
        uint _id
    ) public view returns (uint, bytes32, bytes32, uint) {
        Candidate memory candidate = candidates[_id];
        return (
            candidate.id,
            candidate.name,
            candidate.imageUrl,
            candidate.voteCount
        );
    }
}
