export default {
    methods: {
        existsDOMElement($el, className) {
            if (!$el) {
                return false;
            }
            if ($el.classList && $el.classList.contains(className)) {
                return true;
            }
            while($el.parentNode != null) {
                if ($el.parentNode.classList && $el.parentNode.classList.contains(className)) {
                    return true;
                }
                $el = $el.parentNode;
            }
            return false;
        }
    }
}